-- CreateTable
CREATE TABLE "stocks" (
    "id" SERIAL NOT NULL,
    "tipo_papel" VARCHAR,
    "papel" VARCHAR,
    "cotacao" VARCHAR,
    "tipo" VARCHAR,
    "data_ult_cot" VARCHAR,
    "empresa" VARCHAR,
    "min_52_sem" VARCHAR,
    "setor" VARCHAR,
    "max_52_sem" VARCHAR,
    "subsetor" VARCHAR,
    "vol_med_2m" VARCHAR,
    "valor_de_mercado" VARCHAR,
    "ult_balanco_processado" VARCHAR,
    "valor_da_firma" VARCHAR,
    "nro_acoes" VARCHAR,
    "p_l" VARCHAR,
    "lpa" VARCHAR,
    "p_vp" VARCHAR,
    "vpa" VARCHAR,
    "p_ebit" VARCHAR,
    "marg_bruta" VARCHAR,
    "psr" VARCHAR,
    "marg_ebit" VARCHAR,
    "p_ativos" VARCHAR,
    "marg_liquida" VARCHAR,
    "p_cap_giro" VARCHAR,
    "ebit_ativo" VARCHAR,
    "p_ativ_circ_liq" VARCHAR,
    "roic" VARCHAR,
    "div_yield" VARCHAR,
    "roe" VARCHAR,
    "ev_ebitda" VARCHAR,
    "liquidez_corr" VARCHAR,
    "ev_ebit" VARCHAR,
    "div_br_patrim" VARCHAR,
    "cres_rec_5a" VARCHAR,
    "giro_ativos" VARCHAR,
    "ativo" VARCHAR,
    "depositos" VARCHAR,
    "cart_de_credito" VARCHAR,
    "patrim_liq" VARCHAR,
    "result_int_financ_12m" VARCHAR,
    "result_int_financ_3m" VARCHAR,
    "rec_servicos_12m" VARCHAR,
    "rec_servicos_3m" VARCHAR,
    "lucro_liquido_12m" VARCHAR,
    "lucro_liquido_3m" VARCHAR,
    "div_bruta" VARCHAR,
    "disponibilidades" VARCHAR,
    "div_liquida" VARCHAR,
    "ativo_circulante" VARCHAR,
    "receita_liquida_12m" VARCHAR,
    "receita_liquida_3m" VARCHAR,
    "ebit_12m" VARCHAR,
    "ebit_3m" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reit" (
    "id" SERIAL NOT NULL,
    "cotacao" VARCHAR,
    "segmento" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "papel" VARCHAR NOT NULL,
    "tipo_papel" VARCHAR,
    "fii" VARCHAR,
    "nome" VARCHAR,
    "data_ult_cot" VARCHAR,
    "mandato" VARCHAR,
    "min_52_sem" VARCHAR,
    "max_52_sem" VARCHAR,
    "gestao" VARCHAR,
    "vol_med_2m" VARCHAR,
    "valor_de_mercado" VARCHAR,
    "nro_cotas" VARCHAR,
    "relatorio" VARCHAR,
    "ult_info_trimestral" VARCHAR,
    "ffo_yield" VARCHAR,
    "ffo_cota" VARCHAR,
    "div_yield" VARCHAR,
    "dividendo_cota" VARCHAR,
    "p_vp" VARCHAR,
    "vp_cota" VARCHAR,
    "receita_12m" VARCHAR,
    "receita_3m" VARCHAR,
    "venda_de_ativos_12m" VARCHAR,
    "venda_de_ativos_3m" VARCHAR,
    "ffo_12m" VARCHAR,
    "ffo_3m" VARCHAR,
    "rend_distribuido_12m" VARCHAR,
    "rend_distribuido_3m" VARCHAR,
    "ativos" VARCHAR,
    "patrim_liquido" VARCHAR,
    "qtd_imoveis" VARCHAR,
    "area_m2" VARCHAR,
    "cap_rate" VARCHAR,
    "qtd_unidades" VARCHAR,
    "aluguel_m2" VARCHAR,
    "vacancia_media" VARCHAR,
    "imoveis_pl_do_fii" VARCHAR,
    "preco_do_m2" VARCHAR,

    CONSTRAINT "reit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR NOT NULL,
    "nome_snake" VARCHAR NOT NULL,
    "descricao" VARCHAR NOT NULL,
    "tipo_papel" VARCHAR,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stocks_papel_key" ON "stocks"("papel");

-- CreateIndex
CREATE UNIQUE INDEX "reit_papel_key" ON "reit"("papel");

-- CreateIndex
CREATE UNIQUE INDEX "fields_nome_snake_key" ON "fields"("nome_snake");
