import { Produto } from 'src/produto/produto';
import { Entity, Column, PrimaryGeneratedColumn, ObjectId, OneToMany } from 'typeorm';

@Entity('fornecedor') // Corrigido o nome da tabela
export class Fornecedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  empresa: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column()
  endereco: string;

  @OneToMany(() => Produto, (produto) => produto.fornecedor)
  produto: Produto[];
}
