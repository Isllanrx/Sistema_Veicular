"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MovimentacaoService, Movimentacao } from "@/lib/services/movimentacao.service"
import { ProdutoService, Produto } from "@/lib/services/produto.service"
import { toast } from "sonner"
import { ArrowUpCircle, ArrowDownCircle, Search, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movimentacao[]>([])
  const [products, setProducts] = useState<Produto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ENTRADA" | "SAIDA" | "">("")
  const [dateFilter, setDateFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const movimentacaoService = new MovimentacaoService()
  const produtoService = new ProdutoService()
  const pathname = usePathname()

  async function loadMovements() {
    try {
      setLoading(true)
      const data = await movimentacaoService.getAll()
      // Sort movements by date in descending order (most recent first)
      const sortedData = data.sort((a: Movimentacao, b: Movimentacao) => 
        new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
      )
      setMovements(sortedData)
    } catch (error) {
      toast.error("Não foi possível carregar os movimentos")
    } finally {
      setLoading(false)
    }
  }

  async function loadProducts() {
    try {
      // Get all products including soft-deleted ones
      const data = await produtoService.getAll()
      setProducts(data)
    } catch (error) {
      toast.error("Não foi possível carregar os produtos")
    }
  }

  useEffect(() => {
    loadMovements()
    loadProducts()
  }, [pathname])

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId)
    return product?.nome || "Produto não encontrado"
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Data inválida"
      }
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  const filteredMovements = movements.filter((movement) => {
    const productName = getProductName(movement.produtoId).toLowerCase()
    const matchesSearch = productName.includes(searchTerm.toLowerCase()) ||
                         movement.observacao?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || movement.tipo === typeFilter
    const matchesDate = !dateFilter || movement.data_criacao.startsWith(dateFilter)
    return matchesSearch && matchesType && matchesDate
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Movimentações</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por produto ou observação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "ENTRADA" | "SAIDA" | "")}
              >
                <option value="">Todos os tipos</option>
                <option value="ENTRADA">Entradas</option>
                <option value="SAIDA">Saídas</option>
              </select>
              <div className="flex items-center gap-2 h-10 rounded-md border border-input bg-background px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border-0 p-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum movimento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {formatDate(movement.data_criacao)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getProductName(movement.produtoId)}
                      </TableCell>
                      <TableCell>
                        {movement.tipo === "ENTRADA" ? (
                          <Badge className="bg-[#10B981] flex items-center gap-1 w-fit">
                            <ArrowUpCircle className="h-3 w-3" />
                            Entrada
                          </Badge>
                        ) : (
                          <Badge className="bg-[#F59E0B] flex items-center gap-1 w-fit">
                            <ArrowDownCircle className="h-3 w-3" />
                            Saída
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{movement.quantidade}</TableCell>
                      <TableCell>{movement.observacao}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
