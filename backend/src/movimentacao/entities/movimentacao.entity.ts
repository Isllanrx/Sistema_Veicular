import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { Usuario } from 'src/usuario/usuario';

@Entity()
export class Movimentacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({enum: ['ENTRADA', 'SAIDA']})
  tipo: 'ENTRADA' | 'SAIDA';

  @Column()
  quantidade: number;

  @Column({ nullable: true })
  observacao: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({nullable: true})
  data_exclusao: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.movimentacao)
  usuario: Usuario;
  @Column()
  usuarioId: number;

  @ManyToOne(() => Produto, (produto) => produto.movimentacao)
  produto: Produto;

  @Column()
  produtoId: number;
}
