import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Fornecedor } from 'src/fornecedor/fornecedor';
import { Movimentacao } from 'src/movimentacao/entities/movimentacao.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany } from 'typeorm';

@Entity('produto') // Tabela do Banco
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({nullable: true})
  descricao: string;

  @Column({ nullable: true , default: 0.0, type: 'decimal', precision: 10, scale: 2})
  preco: number;

  @Column({default: 0})
  quantidade: number;

  @ManyToOne(() => Fornecedor, (fornecedor) => fornecedor.produto)
  fornecedor: Fornecedor;

  @Column()
  fornecedorId: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.produto)
  categoria: Categoria;
  @Column()
  categoriaId: number;

  @OneToMany(() => Movimentacao, (movimentacao) => movimentacao.produtoId)
  movimentacao: Movimentacao[];

  @Column({ nullable: true })
  deleted_at: Date;
}

