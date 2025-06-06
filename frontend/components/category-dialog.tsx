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
import { CategoriaService, Categoria } from "@/lib/services/categoria.service"
import { useToast } from "@/components/ui/use-toast"

interface CategoryDialogProps {
  children: React.ReactNode
  category?: Categoria
  onSuccess?: () => void
}

export function CategoryDialog({ children, category, onSuccess }: CategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState(category?.nome || "")
  const [descricao, setDescricao] = useState(category?.descricao || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const categoriaService = new CategoriaService()

  const isEditing = !!category

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && category) {
        await categoriaService.update(category.id, { nome, descricao })
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso",
        })
      } else {
        await categoriaService.create({ nome, descricao })
        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso",
        })
      }
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditing 
          ? "Não foi possível atualizar a categoria"
          : "Não foi possível criar a categoria",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite os detalhes da categoria abaixo."
                : "Preencha os detalhes para criar uma nova categoria."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
