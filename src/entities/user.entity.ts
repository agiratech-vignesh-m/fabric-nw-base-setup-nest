import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('WEB3UsersTest')
export class WEB3UsersTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  org: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  user_Id: string;

  @Column({ type: 'text', nullable: false })
  user_data: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
