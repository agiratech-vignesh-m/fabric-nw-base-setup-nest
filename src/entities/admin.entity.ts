// import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// @Entity({ name: 'WEB3Admins' })
// @Unique(['admin_Id'])
// export class Admin {
//   @PrimaryGeneratedColumn('uuid')
//   id: number;

//   @Column({ type: 'varchar', length: 255, nullable: false })
//   org: string;

//   @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
//   admin_Id: string;

//   @Column({ type: 'text', nullable: false })
//   admin_data: string;

//   @CreateDateColumn()
//   public created_at: Date;

//   @UpdateDateColumn()
//   public updated_at: Date;
// }
