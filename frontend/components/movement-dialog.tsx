"use client"

import type React from "react"
import { useState } from "react"
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
import { MovimentacaoService, Movimentacao } from "@/lib/services/movimentacao.service"
import { toast } from "sonner"

interface MovementDialogProps {
  children: React.ReactNode
  product: {
    id: number
    nome: string
    quantidade: number
  }
  type: "entrada" | "saida"
  onSuccess?: () => void
}

export function MovementDialog({ children, product, type, onSuccess }: MovementDialogProps) {
  const [open, setOpen] = useState(false)
  const [quantidade, setQuantidade] = useState("")
  const [observacao, setObservacao] = useState("")
  const [loading, setLoading] = useState(false)
  const movimentacaoService = new MovimentacaoService()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        produtoId: product.id,
        tipo: type.toUpperCase() as "ENTRADA" | "SAIDA",
        quantidade: parseInt(quantidade),
        observacao,
      }

      await movimentacaoService.create(data)
      toast.success(`Movimento de ${type === "entrada" ? "entrada" : "saída"} registrado com sucesso`)
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Erro ao registrar movimento de ${type === "entrada" ? "entrada" : "saída"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {type === "entrada" ? "Registrar Entrada" : "Registrar Saída"}
            </DialogTitle>
            <DialogDescription>
              {type === "entrada"
                ? "Registre uma entrada de estoque para este produto."
                : "Registre uma saída de estoque para este produto."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="produto" className="text-right">
                Produto
              </Label>
              <div className="col-span-3">
                <p className="text-sm">{product.nome}</p>
                <p className="text-sm text-muted-foreground">
                  Estoque atual: {product.quantidade}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantidade" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="col-span-3"
                required
                min={1}
                max={type === "saida" ? product.quantidade : undefined}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observacao" className="text-right">
                Observação
              </Label>
              <Textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Registrando..."
                : type === "entrada"
                ? "Registrar entrada"
                : "Registrar saída"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
