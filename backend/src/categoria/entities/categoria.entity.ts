import { Produto } from 'src/produto/entities/produto.entity';
import { Entity, Column, PrimaryGeneratedColumn, ObjectId, OneToMany } from 'typeorm';

@Entity('categoria') // Tabela do Banco
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;
  
  @Column({default: true, nullable: true})
  ativa: boolean;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produto: Produto[];
}

