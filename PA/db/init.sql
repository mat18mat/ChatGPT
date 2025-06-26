CREATE TABLE Role (
    IdRole INT PRIMARY KEY AUTO_INCREMENT,
    Nom VARCHAR(50) UNIQUE
);

CREATE TABLE Entrepot (
    IdEntrepot INT PRIMARY KEY AUTO_INCREMENT,
    Localisation VARCHAR(255),
    Secteur VARCHAR(100),
    Capacite INT
);

CREATE TABLE Etape (
    IdEtape INT PRIMARY KEY AUTO_INCREMENT,
    TempsDebut TIME,
    TempsFin TIME,
    Nom VARCHAR(255),
    Debut TIME,
    Fin TIME,
    Valide BOOLEAN,
    Description TEXT
);

CREATE TABLE Statistiques (
    IdStatistique INT PRIMARY KEY AUTO_INCREMENT,
    TypeStatistique VARCHAR(100),
    Categorie VARCHAR(100),
    Valeur DECIMAL(12, 2),
    TexteOptionnel TEXT,
    IdSource INT,
    SourceType ENUM('Utilisateur', 'Facture', 'Course', 'Annonce', 'Livreur', 'Prestataire', 'Evaluation'),
    DateCalcul DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Utilisateur (
    IdUtilisateur INT PRIMARY KEY AUTO_INCREMENT,
    Nom VARCHAR(100),
    Prenom VARCHAR(100),
    Mail VARCHAR(100) UNIQUE,
    PieceIdentite TEXT,
    NoteMoyenne FLOAT,
    Telephone VARCHAR(20) UNIQUE,
    Mdp VARCHAR(255),
    Adresse TEXT,
    DateNaissance DATE,
    DateInscription DATE,
    LanguePreferee VARCHAR(20),
    TutorielVu BOOLEAN DEFAULT FALSE,
    Banni BOOLEAN DEFAULT FALSE,
    PhotoProfil TEXT,
    JustificatifDomicile TEXT,
    QRCode TEXT,
    IdRole INT,
    FOREIGN KEY (IdRole) REFERENCES Role(IdRole)
);

CREATE TABLE Contrat (
    IdContrat INT PRIMARY KEY AUTO_INCREMENT,
    TypeContrat VARCHAR(50),
    Debut DATE,
    Fin DATE,
    Remuneration DECIMAL(10, 2),
    MethodeRemuneration VARCHAR(100),
    Description TEXT,
    Statut ENUM('en attente', 'actif', 'refuse', 'terminee'),
    IdContracteur INT,
    IdDemandeur INT,
    LienPDF TEXT,
    Template BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (IdContracteur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdDemandeur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Document (
    IdDocument INT PRIMARY KEY AUTO_INCREMENT,
    IdUtilisateur INT,
    TypeDocument ENUM('Identite', 'Justificatif', 'Permis', 'Assurance', 'Diplome', 'KBIS') NOT NULL,
    Fichier TEXT,
    DateAjout DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE LOG (
    IdLog INT PRIMARY KEY AUTO_INCREMENT,
    Action TEXT,
    DateEvenement DATETIME,
    IP VARCHAR(45),
    NavigateurAppareil TEXT,
    IdUtilisateur INT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Notification (
    IdNotification INT PRIMARY KEY AUTO_INCREMENT,
    Message TEXT,
    Date DATE,
    Lu BOOLEAN,
    Type VARCHAR(50),
    IdUtilisateur INT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE RoleUtilisateur (
    IdUtilisateur INT,
    IdRole INT,
    PRIMARY KEY (IdUtilisateur, IdRole),
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdRole) REFERENCES Role(IdRole)
);

CREATE TABLE Abonnement (
    IdAbonnement INT PRIMARY KEY AUTO_INCREMENT,
    IdUtilisateur INT,
    Nom VARCHAR(100),
    PrixMensuel DECIMAL(10, 2),
    Assurance BOOLEAN,
    Reduction DECIMAL(10, 2),
    LivraisonPrioritaire BOOLEAN,
    ColisOfferts INT,
    Avantages TEXT,
    Recurence ENUM('Mensuel', 'Annuel'),
    DateDebut DATE,
    DateFin DATE,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Tache (
    IdTache INT PRIMARY KEY AUTO_INCREMENT,
    Temps TIME,
    Debut TIME,
    Fin TIME,
    DateJour DATE,
    IdUtilisateur INT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Livreurs (
    IdLivreur INT PRIMARY KEY AUTO_INCREMENT,
    OptionGrossiste BOOLEAN,
    Vehicule VARCHAR(50),
    Actif BOOLEAN DEFAULT TRUE,
    IdUtilisateur INT,
    IdContrat INT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdContrat) REFERENCES Contrat(IdContrat)
);

CREATE TABLE ZoneTravail (
    IdZoneTravail INT AUTO_INCREMENT PRIMARY KEY,
    IdUtilisateur INT,
    Pays VARCHAR(100),
    Ville VARCHAR(100),
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE BoxStockage (
    IdBox INT PRIMARY KEY AUTO_INCREMENT,
    IdUtilisateur INT,
    IdEntrepot INT,
    DateDebut DATE,
    DateFin DATE,
    Taille ENUM('petite', 'moyenne', 'grande'),
    TypeBox ENUM('standard', 'temperee'),
    Statut ENUM('active', 'terminee', 'en attente'),
    Assurance BOOLEAN DEFAULT FALSE,
    Description TEXT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdEntrepot) REFERENCES Entrepot(IdEntrepot)
);

CREATE TABLE BoxAccess (
    IdAccess INT PRIMARY KEY AUTO_INCREMENT,
    IdBox INT,
    EmailInvite VARCHAR(100),
    TypeAcces ENUM('lecture', 'complet'),
    FOREIGN KEY (IdBox) REFERENCES BoxStockage(IdBox)
);

CREATE TABLE Recoit (
    IdNotification INT,
    IdUtilisateur INT,
    PRIMARY KEY (IdNotification, IdUtilisateur),
    FOREIGN KEY (IdNotification) REFERENCES Notification(IdNotification),
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Facture (
    IdFacture INT PRIMARY KEY AUTO_INCREMENT,
    MontantTotal DECIMAL(10, 2),
    DateCreation DATE,
    LienPDF TEXT,
    IdUtilisateur INT,
    IdAbonnement INT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdAbonnement) REFERENCES Abonnement(IdAbonnement)
);

CREATE TABLE Annonce (
    IdAnnonce INT PRIMARY KEY AUTO_INCREMENT,
    Description TEXT,
    Type VARCHAR(50),
    IdTache INT,
    Temps TIME,
    Prix DECIMAL(10, 2),
    Debut TIME,
    Fin TIME,
    Pays VARCHAR(100),
    Titre VARCHAR(100),
    Statut ENUM('brouillon', 'publiee', 'terminee'),
    Adresse TEXT,
    DateSouhaitee DATE,
    LienImage TEXT,
    IdCreateur INT,
    FOREIGN KEY (IdCreateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdTache) REFERENCES Tache(IdTache)
);

CREATE TABLE Course (
    IdCourse INT PRIMARY KEY AUTO_INCREMENT,
    Debut DATETIME,
    Fin DATETIME,
    Valide BOOLEAN,
    Prix DECIMAL(10,2),
    Description TEXT,
    AdresseDepart TEXT,
    AdresseArrivee TEXT,
    Statut ENUM('en attente', 'en cours', 'livree'),
    IdLivreur INT,
    IdExpediteur INT,
    FOREIGN KEY (IdLivreur) REFERENCES Livreurs(IdLivreur),
    FOREIGN KEY (IdExpediteur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE MoyenPaiement (
    IdMoyenPaiement INT PRIMARY KEY AUTO_INCREMENT,
    IdUtilisateur INT,
    TypePaiement ENUM('Carte', 'IBAN'),
    Informations TEXT,
    ParDefaut BOOLEAN DEFAULT FALSE,
    DateAjout DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Paiement (
    IdPaiement INT PRIMARY KEY AUTO_INCREMENT,
    IdUtilisateur INT,
    Montant DECIMAL(10, 2),
    TypePaiement ENUM('Mensuel', 'Sur Place'),
    DatePaiement DATE,
    Statut ENUM('Effectue', 'En Attente', 'Echoue'),
    IdFacture INT,
    IdMoyenPaiement INT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdFacture) REFERENCES Facture(IdFacture),
    FOREIGN KEY (IdMoyenPaiement) REFERENCES MoyenPaiement (IdMoyenPaiement)
);

CREATE TABLE Prestataire (
    IdPrestataire INT PRIMARY KEY AUTO_INCREMENT,
    OptionGrossiste BOOLEAN,
    Habilitations TEXT,
    Tarifs TEXT,
    Approuve BOOLEAN,
    Actif BOOLEAN DEFAULT TRUE,
    IdAnnonce INT,
    IdContrat INT,
    FOREIGN KEY (IdAnnonce) REFERENCES Annonce(IdAnnonce),
    FOREIGN KEY (IdContrat) REFERENCES Contrat(IdContrat)
);

CREATE TABLE Commercant (
    IdCommercant INT PRIMARY KEY AUTO_INCREMENT,
    IdContrat INT,
    OptionGrossiste BOOLEAN,
    HeureOuverture TIME,
    Actif BOOLEAN DEFAULT TRUE,
    NomCommerce VARCHAR(100),
    TypeCommerce VARCHAR(50),
    SIRET VARCHAR(20),
    IdEntrepot INT,
    IdUtilisateur INT,
    IdCourse INT,
    FOREIGN KEY (IdEntrepot) REFERENCES Entrepot(IdEntrepot),
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdCourse) REFERENCES Course(IdCourse),
    FOREIGN KEY (IdContrat) REFERENCES Contrat(IdContrat)
);

CREATE TABLE EffectuePar (
    IdLivreur INT,
    IdCourse INT,
    PRIMARY KEY (IdLivreur, IdCourse),
    FOREIGN KEY (IdLivreur) REFERENCES Livreurs(IdLivreur),
    FOREIGN KEY (IdCourse) REFERENCES Course(IdCourse)
);

CREATE TABLE ContientEtape (
    IdEtape INT,
    IdCourse INT,
    PRIMARY KEY (IdEtape, IdCourse),
    FOREIGN KEY (IdEtape) REFERENCES Etape(IdEtape),
    FOREIGN KEY (IdCourse) REFERENCES Course(IdCourse)
);

CREATE TABLE Colis (
    IdColis INT PRIMARY KEY AUTO_INCREMENT,
    Description TEXT,
    Dimensions TEXT,
    IdDestinataire INT,
    IdUtilisateur INT,
    IdCourse INT,
    FOREIGN KEY (IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur),
    FOREIGN KEY (IdCourse) REFERENCES Course(IdCourse),
    FOREIGN KEY (IdDestinataire) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Evaluation (
    IdEvaluation INT PRIMARY KEY AUTO_INCREMENT,
    Note INT,
    Commentaire TEXT,
    Date DATE,
    TypeDestinataire ENUM('Prestataire', 'Livreur', 'Commercant', 'Utilisateur'),
    IdCible INT,
    IdEvalueur INT,
    FOREIGN KEY (IdEvalueur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE Conversation (
    IdConversation INT PRIMARY KEY AUTO_INCREMENT,
    Sujet TEXT,
    DateCreation DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Message (
    IdMessage INT PRIMARY KEY AUTO_INCREMENT,
    IdConversation INT,
    IdEnvoyeur INT,
    Contenu TEXT,
    DateEnvoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    Lu BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (IdConversation) REFERENCES Conversation(IdConversation),
    FOREIGN KEY (IdEnvoyeur) REFERENCES Utilisateur(IdUtilisateur)
);

CREATE TABLE MediaAnnonce (
    IdMedia INT PRIMARY KEY AUTO_INCREMENT,
    IdAnnonce INT,
    LienMedia TEXT,
    FOREIGN KEY (IdAnnonce) REFERENCES Annonce(IdAnnonce)
);

CREATE TABLE Langue (
  Code VARCHAR(10) PRIMARY KEY,
  NomAffiche VARCHAR(100) NOT NULL,
  FichierJSON TEXT NOT NULL
);