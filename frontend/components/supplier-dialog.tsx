"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FornecedorService, Fornecedor } from "@/lib/services/fornecedor.service"
import { toast } from "sonner"

interface SupplierDialogProps {
  children: React.ReactNode
  supplier?: Fornecedor
  onSuccess?: () => void
}

export function SupplierDialog({ children, supplier, onSuccess }: SupplierDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [endereco, setEndereco] = useState("")
  const fornecedorService = new FornecedorService()

  useEffect(() => {
    if (supplier) {
      setNome(supplier.nome)
      setEmpresa(supplier.empresa)
      setEmail(supplier.email)
      setTelefone(supplier.telefone)
      setEndereco(supplier.endereco)
    }
  }, [supplier])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        nome,
        empresa,
        email,
        telefone,
        endereco,
      }

      if (supplier) {
        await fornecedorService.update(supplier.id, data)
        toast.success("Fornecedor atualizado com sucesso!")
      } else {
        await fornecedorService.create(data)
        toast.success("Fornecedor cadastrado com sucesso!")
      }

      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar fornecedor")
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
              {supplier ? "Editar Fornecedor" : "Novo Fornecedor"}
            </DialogTitle>
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
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : supplier ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
