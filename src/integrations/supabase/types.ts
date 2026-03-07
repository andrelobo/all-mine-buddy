export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cnae_catalogo: {
        Row: {
          anexo: string
          codigo_cnae: string
          created_at: string
          descricao: string
          id: string
          permite_fator_r: boolean
        }
        Insert: {
          anexo?: string
          codigo_cnae: string
          created_at?: string
          descricao?: string
          id?: string
          permite_fator_r?: boolean
        }
        Update: {
          anexo?: string
          codigo_cnae?: string
          created_at?: string
          descricao?: string
          id?: string
          permite_fator_r?: boolean
        }
        Relationships: []
      }
      notas_fiscais: {
        Row: {
          aliquota: number | null
          base_calculo: number | null
          codigo_servico: string | null
          created_at: string
          data_emissao: string | null
          desconto: number | null
          descricao_servico: string | null
          id: string
          iss_retido: boolean | null
          iss_valor: number | null
          local_prestacao_municipio: string | null
          local_prestacao_pais: string | null
          local_prestacao_uf: string | null
          numero_nfse: string | null
          parametro_iss_aplicado: string | null
          prestador_id: string | null
          ret_cofins: number | null
          ret_csll: number | null
          ret_inss: number | null
          ret_ir: number | null
          ret_pis: number | null
          status: string
          tomador_id: string | null
          updated_at: string
          valor_liquido: number | null
          valor_servico: number | null
        }
        Insert: {
          aliquota?: number | null
          base_calculo?: number | null
          codigo_servico?: string | null
          created_at?: string
          data_emissao?: string | null
          desconto?: number | null
          descricao_servico?: string | null
          id?: string
          iss_retido?: boolean | null
          iss_valor?: number | null
          local_prestacao_municipio?: string | null
          local_prestacao_pais?: string | null
          local_prestacao_uf?: string | null
          numero_nfse?: string | null
          parametro_iss_aplicado?: string | null
          prestador_id?: string | null
          ret_cofins?: number | null
          ret_csll?: number | null
          ret_inss?: number | null
          ret_ir?: number | null
          ret_pis?: number | null
          status?: string
          tomador_id?: string | null
          updated_at?: string
          valor_liquido?: number | null
          valor_servico?: number | null
        }
        Update: {
          aliquota?: number | null
          base_calculo?: number | null
          codigo_servico?: string | null
          created_at?: string
          data_emissao?: string | null
          desconto?: number | null
          descricao_servico?: string | null
          id?: string
          iss_retido?: boolean | null
          iss_valor?: number | null
          local_prestacao_municipio?: string | null
          local_prestacao_pais?: string | null
          local_prestacao_uf?: string | null
          numero_nfse?: string | null
          parametro_iss_aplicado?: string | null
          prestador_id?: string | null
          ret_cofins?: number | null
          ret_csll?: number | null
          ret_inss?: number | null
          ret_ir?: number | null
          ret_pis?: number | null
          status?: string
          tomador_id?: string | null
          updated_at?: string
          valor_liquido?: number | null
          valor_servico?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_tomador_id_fkey"
            columns: ["tomador_id"]
            isOneToOne: false
            referencedRelation: "tomadores"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores: {
        Row: {
          aliquota_simples: string | null
          bairro: string | null
          cep: string | null
          cnae_principal: string | null
          cnaes_lista: Json | null
          cnpj: string
          complemento: string | null
          config_operacionais: Json | null
          created_at: string
          ctn_codigo: string | null
          ctn_descricao: string | null
          ctn_item: string | null
          email: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          localidade_uf: string | null
          logradouro: string | null
          nome_empresarial: string
          nome_fantasia: string | null
          numero: string | null
          optante_simples: boolean | null
          parametro_municipal: Json | null
          rbt12: number | null
          regime_tributario: string | null
          simples_aliquota_efetiva: number | null
          simples_aliquota_nominal: number | null
          simples_anexo: string | null
          simples_data_calculo: string | null
          simples_faixa: number | null
          simples_parametro_iss: string | null
          simples_parcela_deduzir: number | null
          suframa: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          aliquota_simples?: string | null
          bairro?: string | null
          cep?: string | null
          cnae_principal?: string | null
          cnaes_lista?: Json | null
          cnpj: string
          complemento?: string | null
          config_operacionais?: Json | null
          created_at?: string
          ctn_codigo?: string | null
          ctn_descricao?: string | null
          ctn_item?: string | null
          email?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          localidade_uf?: string | null
          logradouro?: string | null
          nome_empresarial?: string
          nome_fantasia?: string | null
          numero?: string | null
          optante_simples?: boolean | null
          parametro_municipal?: Json | null
          rbt12?: number | null
          regime_tributario?: string | null
          simples_aliquota_efetiva?: number | null
          simples_aliquota_nominal?: number | null
          simples_anexo?: string | null
          simples_data_calculo?: string | null
          simples_faixa?: number | null
          simples_parametro_iss?: string | null
          simples_parcela_deduzir?: number | null
          suframa?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          aliquota_simples?: string | null
          bairro?: string | null
          cep?: string | null
          cnae_principal?: string | null
          cnaes_lista?: Json | null
          cnpj?: string
          complemento?: string | null
          config_operacionais?: Json | null
          created_at?: string
          ctn_codigo?: string | null
          ctn_descricao?: string | null
          ctn_item?: string | null
          email?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          localidade_uf?: string | null
          logradouro?: string | null
          nome_empresarial?: string
          nome_fantasia?: string | null
          numero?: string | null
          optante_simples?: boolean | null
          parametro_municipal?: Json | null
          rbt12?: number | null
          regime_tributario?: string | null
          simples_aliquota_efetiva?: number | null
          simples_aliquota_nominal?: number | null
          simples_anexo?: string | null
          simples_data_calculo?: string | null
          simples_faixa?: number | null
          simples_parametro_iss?: string | null
          simples_parcela_deduzir?: number | null
          suframa?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      simples_anexo_iii: {
        Row: {
          aliquota_nominal: number
          created_at: string
          faixa: number
          id: string
          limite_inferior: number
          limite_superior: number
          parcela_deduzir: number
          percentual_iss: number
        }
        Insert: {
          aliquota_nominal: number
          created_at?: string
          faixa: number
          id?: string
          limite_inferior?: number
          limite_superior: number
          parcela_deduzir?: number
          percentual_iss?: number
        }
        Update: {
          aliquota_nominal?: number
          created_at?: string
          faixa?: number
          id?: string
          limite_inferior?: number
          limite_superior?: number
          parcela_deduzir?: number
          percentual_iss?: number
        }
        Relationships: []
      }
      split_payment: {
        Row: {
          created_at: string
          id: string
          mes_referencia: string
          nota_fiscal_id: string | null
          prestador_id: string | null
          status: string
          updated_at: string
          valor_bruto: number
          valor_liberado: number
          valor_reservado: number
        }
        Insert: {
          created_at?: string
          id?: string
          mes_referencia?: string
          nota_fiscal_id?: string | null
          prestador_id?: string | null
          status?: string
          updated_at?: string
          valor_bruto?: number
          valor_liberado?: number
          valor_reservado?: number
        }
        Update: {
          created_at?: string
          id?: string
          mes_referencia?: string
          nota_fiscal_id?: string | null
          prestador_id?: string | null
          status?: string
          updated_at?: string
          valor_bruto?: number
          valor_liberado?: number
          valor_reservado?: number
        }
        Relationships: [
          {
            foreignKeyName: "split_payment_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "split_payment_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
        ]
      }
      tomadores: {
        Row: {
          bairro: string | null
          cep: string | null
          cnpj_cpf: string
          complemento: string | null
          created_at: string
          email: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          localidade_uf: string | null
          logradouro: string | null
          nome_fantasia: string | null
          nome_razao_social: string
          numero: string | null
          pais: string | null
          prestador_id: string | null
          substituto_tributario: boolean | null
          suframa: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cnpj_cpf?: string
          complemento?: string | null
          created_at?: string
          email?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          localidade_uf?: string | null
          logradouro?: string | null
          nome_fantasia?: string | null
          nome_razao_social?: string
          numero?: string | null
          pais?: string | null
          prestador_id?: string | null
          substituto_tributario?: boolean | null
          suframa?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cnpj_cpf?: string
          complemento?: string | null
          created_at?: string
          email?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          localidade_uf?: string | null
          logradouro?: string | null
          nome_fantasia?: string | null
          nome_razao_social?: string
          numero?: string | null
          pais?: string | null
          prestador_id?: string | null
          substituto_tributario?: boolean | null
          suframa?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tomadores_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
