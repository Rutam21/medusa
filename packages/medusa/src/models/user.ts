import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Column,
  PrimaryColumn,
  ColumnType,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

export type ActionableProps = string | number | Date | ColumnType

export type Updateable = ActionableProps & {
  _opaqueType: "Updateable"
}
export type Createable = ActionableProps & {
  _opaqueType: "Createable"
}

export type Actionable<T extends ActionableProps> = T

@Entity()
export class User {
  @PrimaryColumn()
  id: Actionable<Createable>

  @Index({ unique: true })
  @Column()
  email: Actionable<string & Createable & Updateable>

  @Column({ nullable: true })
  last_name: Actionable<string & Createable & Updateable>

  @Column({ nullable: true, select: false })
  password_hash: Actionable<string & Createable & Updateable>

  @Column({ nullable: true })
  api_token: Actionable<string & Createable & Updateable>

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `usr_${id}`
  }
}

/**
 * @schema user
 * title: "User"
 * description: "Represents a User who can manage store settings."
 * x-resourceId: user
 * properties:
 *   id:
 *     description: "The unique id of the User. This will be prefixed with `usr_`"
 *     type: string
 *   email:
 *     description: "The email of the User"
 *     type: string
 *   first_name:
 *     type: string
 *   last_name:
 *     description: "The Customer's billing address."
 *     anyOf:
 *       - $ref: "#/components/schemas/address"
 *   created_at:
 *     type: string
 *     format: date-time
 *   updated_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   metadata:
 *     type: object
 */
