'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash } from "lucide-react"
import { SupplierDialog } from "@/components/supplier-dialog"
import { FornecedorService, Fornecedor } from "@/lib/services/fornecedor.service"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Fornecedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const fornecedorService = new FornecedorService();

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setIsLoading(true);
      const data = await fornecedorService.getAll();
      setSuppliers(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fornecedores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await fornecedorService.delete(id);
      toast({
        title: "Sucesso",
        description: "Fornecedor excluído com sucesso",
      });
      loadSuppliers();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o fornecedor",
        variant: "destructive",
      });
    }
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.telefone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
        <SupplierDialog onSuccess={loadSuppliers}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Fornecedor
          </Button>
        </SupplierDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar fornecedores..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Nenhum fornecedor encontrado</TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.nome}</TableCell>
                      <TableCell>{supplier.empresa}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.telefone}</TableCell>
                      <TableCell>{supplier.endereco}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <SupplierDialog supplier={supplier} onSuccess={loadSuppliers}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </SupplierDialog>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(supplier.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
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
