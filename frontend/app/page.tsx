"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Tag, Truck, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InventoryChart } from "@/components/inventory-chart"
import { ProdutoService } from "@/lib/services/produto.service"
import { MovimentacaoService } from "@/lib/services/movimentacao.service"
import { CategoriaService } from "@/lib/services/categoria.service"
import { FornecedorService } from "@/lib/services/fornecedor.service"
import { Produto } from "@/lib/services/produto.service"
import { Movimentacao } from "@/lib/services/movimentacao.service"

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [categorias, setCategorias] = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const produtoService = new ProdutoService()
      const movimentacaoService = new MovimentacaoService()
      const categoriaService = new CategoriaService()
      const fornecedorService = new FornecedorService()

      const [produtosData, movimentacoesData, categoriasData, fornecedoresData] = await Promise.all([
        produtoService.getAll(),
        movimentacaoService.getAll(),
        categoriaService.getAll(),
        fornecedorService.getAll()
      ])

      setProdutos(produtosData)
      setMovimentacoes(movimentacoesData)
      setCategorias(categoriasData)
      setFornecedores(fornecedoresData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular estatísticas
  const totalProdutos = produtos.length
  const totalCategorias = categorias.length
  const totalFornecedores = fornecedores.length
  const produtosEstoqueBaixo = produtos.filter(p => p.quantidade < 10).length

  // Calcular movimentações dos últimos 30 dias
  const trintaDiasAtras = new Date()
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)
  
  const movimentacoesRecentes = movimentacoes.filter(m => 
    new Date(m.data_criacao) >= trintaDiasAtras
  )

  const entradasRecentes = movimentacoesRecentes.filter(m => m.tipo === 'ENTRADA').length
  const saidasRecentes = movimentacoesRecentes.filter(m => m.tipo === 'SAIDA').length

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-[#1D4ED8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Tag className="h-4 w-4 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategorias}</div>
            <p className="text-xs text-muted-foreground">Categorias ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <Truck className="h-4 w-4 text-[#1D4ED8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFornecedores}</div>
            <p className="text-xs text-muted-foreground">Fornecedores cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos com Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtosEstoqueBaixo}</div>
            <p className="text-xs text-muted-foreground">Necessitam reposição urgente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
            <CardDescription>Entradas e saídas de produtos nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <InventoryChart movimentacoes={movimentacoesRecentes} />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entradas Recentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#10B981]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entradasRecentes}</div>
              <p className="text-xs text-muted-foreground">Produtos adicionados nos últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saídas Recentes</CardTitle>
              <TrendingDown className="h-4 w-4 text-[#F59E0B]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{saidasRecentes}</div>
              <p className="text-xs text-muted-foreground">Produtos retirados nos últimos 30 dias</p>
            </CardContent>
          </Card>

          {produtosEstoqueBaixo > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção!</AlertTitle>
              <AlertDescription>{produtosEstoqueBaixo} produtos estão com estoque abaixo do mínimo recomendado.</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
