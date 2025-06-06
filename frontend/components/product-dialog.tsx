"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProdutoService, Produto } from "@/lib/services/produto.service"
import { CategoriaService, Categoria } from "@/lib/services/categoria.service"
import { FornecedorService, Fornecedor } from "@/lib/services/fornecedor.service"
import { toast } from "sonner"

interface ProductDialogProps {
  children: React.ReactNode
  product?: Produto
  onSuccess?: () => void
}

export function ProductDialog({ children, product, onSuccess }: ProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [categoriaId, setCategoriaId] = useState<string>("")
  const [fornecedorId, setFornecedorId] = useState<string>("")
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  const produtoService = new ProdutoService()
  const categoriaService = new CategoriaService()
  const fornecedorService = new FornecedorService()

  useEffect(() => {
    if (product) {
      setNome(product.nome)
      setDescricao(product.descricao || "")
      setPreco(product.preco.toString())
      setQuantidade(product.quantidade.toString())
      setCategoriaId(product.categoriaId.toString())
      setFornecedorId(product.fornecedorId.toString())
    } else {
      // Reset form when opening for new product
      setNome("")
      setDescricao("")
      setPreco("")
      setQuantidade("")
      setCategoriaId("")
      setFornecedorId("")
    }
  }, [product, open])

  useEffect(() => {
    if (open) {
      loadCategorias()
      loadFornecedores()
    }
  }, [open])

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.getAll()
      setCategorias(data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao carregar categorias")
    }
  }

  const loadFornecedores = async () => {
    try {
      const data = await fornecedorService.getAll()
      setFornecedores(data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao carregar fornecedores")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoriaId || !fornecedorId) {
      toast.error("Selecione uma categoria e um fornecedor")
      return
    }

    setLoading(true)

    try {
      const data = {
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        categoriaId: parseInt(categoriaId),
        fornecedorId: parseInt(fornecedorId),
      }

      if (product) {
        await produtoService.update(product.id, data)
        toast.success("Produto atualizado com sucesso!")
      } else {
        await produtoService.create(data)
        toast.success("Produto cadastrado com sucesso!")
      }

      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar produto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {product ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription>
              {product
                ? "Edite os detalhes do produto abaixo."
                : "Preencha os detalhes para criar um novo produto."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preco">Preço</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={categoriaId}
              onValueChange={setCategoriaId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id.toString()}>
                    {categoria.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Select
              value={fornecedorId}
              onValueChange={setFornecedorId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.map((fornecedor) => (
                  <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                    {fornecedor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : product ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
