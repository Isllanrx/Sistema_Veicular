"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Movimentacao } from "@/lib/services/movimentacao.service"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface InventoryChartProps {
  movimentacoes: Movimentacao[]
}

export function InventoryChart({ movimentacoes }: InventoryChartProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (movimentacoes.length > 0) {
      // Agrupar movimentações por data
      const movimentacoesPorData = movimentacoes.reduce((acc: any, mov) => {
        const data = format(new Date(mov.data_criacao), 'dd/MM', { locale: ptBR })
        
        if (!acc[data]) {
          acc[data] = { name: data, entradas: 0, saidas: 0 }
        }

        if (mov.tipo === 'ENTRADA') {
          acc[data].entradas += mov.quantidade
        } else {
          acc[data].saidas += mov.quantidade
        }

        return acc
      }, {})

      // Converter para array e ordenar por data
      const dados = Object.values(movimentacoesPorData).sort((a: any, b: any) => {
        const [diaA, mesA] = a.name.split('/')
        const [diaB, mesB] = b.name.split('/')
        return new Date(2024, parseInt(mesA) - 1, parseInt(diaA)).getTime() - 
               new Date(2024, parseInt(mesB) - 1, parseInt(diaB)).getTime()
      })

      setChartData(dados)
    }
  }, [movimentacoes])

  if (!isMounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="entradas" name="Entradas" fill="#1D4ED8" />
        <Bar dataKey="saidas" name="Saídas" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  )
}
