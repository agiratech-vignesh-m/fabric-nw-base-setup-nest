import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('WEB3AdminsTest')
export class WEB3AdminsTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  org: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  admin_Id: string;

  @Column({ type: 'text', nullable: false })
  admin_data: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
