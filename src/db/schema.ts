import {  text, serial, pgTable, timestamp, numeric } from "drizzle-orm/pg-core";

//👇🏻 Table des factures avec ses types de colonnes
export const tableFactures = pgTable("factures", {
    id: serial("id").primaryKey().notNull(),
    id_proprietaire: text("id_proprietaire").notNull(),
    id_client: text("id_client").notNull(),
    titre: text("titre").notNull(),
    articles: text("articles").notNull(),
    cree_le: timestamp("cree_le").defaultNow(),
    montant_total: numeric("montant_total").notNull(),
});

//👇🏻 Table des clients avec ses types de colonnes
export const tableClients = pgTable("clients", {
    id: serial("id").primaryKey().notNull(),
    cree_le: timestamp("cree_le").defaultNow(),
    id_proprietaire: text("id_proprietaire").notNull(),
    nom: text("nom").notNull(),
    email: text("email").notNull(),
    adresse: text("adresse").notNull(),
})

//👇🏻 Table des informations bancaires avec ses types de colonnes
export const tableInfosBancaires = pgTable("infos_bancaires", {
    id: serial("id").primaryKey().notNull(),
    id_proprietaire: text("id_proprietaire").notNull().unique(),
    nom_banque: text("nom_banque").notNull(),
    numero_compte: numeric("numero_compte").notNull(),
    nom_compte: text("nom_compte").notNull(),
    cree_le: timestamp("cree_le").defaultNow(),
    devise: text("devise").notNull(),
})