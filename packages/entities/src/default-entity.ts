import { PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v7 as uuidv7 } from "uuid";

export abstract class DefaultEntity {
  @PrimaryColumn({ type: "uuid", name: "id", nullable: false })
  id: string = uuidv7();

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    name: "updated_at",
    nullable: false,
  })
  updatedAt: Date;
}
