"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductDialog } from "@/components/product-dialog"
import { MovementDialog } from "@/components/movement-dialog"
import { ProdutoService, Produto } from "@/lib/services/produto.service"
import { toast } from "sonner"
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const produtoService = new ProdutoService()

  const loadProducts = async () => {
    try {
      const data = await produtoService.getAll()
      setProducts(data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return
    }

    try {
      await produtoService.delete(id)
      toast.success("Produto excluído com sucesso!")
      loadProducts()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao excluir produto")
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <ProductDialog onSuccess={loadProducts}>
          <Button>Novo Produto</Button>
        </ProductDialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.nome}</TableCell>
                  <TableCell>{product.descricao}</TableCell>
                  <TableCell>R$ {Number(product.preco).toFixed(2)}</TableCell>
                  <TableCell>{product.quantidade}</TableCell>
                  <TableCell>{product.categoria?.nome}</TableCell>
                  <TableCell>{product.fornecedor?.nome}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ProductDialog product={product} onSuccess={loadProducts}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </ProductDialog>
                      <MovementDialog
                        product={product}
                        type="entrada"
                        onSuccess={loadProducts}
                      >
                        <Button variant="ghost" size="icon" className="text-green-600">
                          <ArrowUpCircle className="h-4 w-4" />
                        </Button>
                      </MovementDialog>
                      <MovementDialog
                        product={product}
                        type="saida"
                        onSuccess={loadProducts}
                      >
                        <Button variant="ghost" size="icon" className="text-orange-600">
                          <ArrowDownCircle className="h-4 w-4" />
                        </Button>
                      </MovementDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
