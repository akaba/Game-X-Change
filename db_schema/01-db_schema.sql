
-- DBA schema
USE gameswap;


CREATE TABLE `User` (
  email VARCHAR(250) NOT NULL,
  postalcode VARCHAR(5) NOT NULL,
  password VARCHAR(60) NOT NULL,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  PRIMARY KEY (email),
  FOREIGN KEY(postalcode) REFERENCES Postalcode(postalcode)
);

CREATE TABLE Phone (
  phonenumber VARCHAR(12) NOT NULL,
  email VARCHAR(250) NOT NULL,
  phonetype VARCHAR(6) NOT NULL,
  showphone BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (phonenumber),
  FOREIGN KEY(email) REFERENCES User(email) ON DELETE CASCADE
);


CREATE TABLE Postalcode (
  postalcode VARCHAR(5) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(2) NOT NULL,
  latitude DECIMAL(10,6) NOT NULL,
  longitude DECIMAL(10,6) NOT NULL,
  PRIMARY KEY (postalcode)
);

CREATE TABLE Item ( 
    itemnumber INTEGER NOT NULL AUTO_INCREMENT,
    email VARCHAR(250) NOT NULL,	
    name VARCHAR(250) NOT NULL,     
    gametype VARCHAR(250) NOT NULL,
	itemcondition VARCHAR(21) NOT NULL,
    PRIMARY KEY(itemnumber),
    FOREIGN KEY(email) REFERENCES User(email) ON DELETE CASCADE	
   );

CREATE TABLE Description (
    itemnumber INTEGER NOT NULL,
    description VARCHAR(250) NOT NULL,
    PRIMARY KEY(itemnumber),
    FOREIGN KEY(itemnumber) REFERENCES Item(itemnumber) ON DELETE CASCADE
);


-- swapstatus: proposed,accepted,rejected,completed
  
CREATE TABLE Swap (
    proposeditemnumber INTEGER NOT NULL,
    desireditemnumber INTEGER NOT NULL,
    proposeddate DATE NOT NULL,
    swapstatus VARCHAR (9) NOT NULL,
    statusdate DATE NULL,
    proposerrating TINYINT NULL,
    counterpartyrating TINYINT NULL,
    PRIMARY KEY(proposeditemnumber, desireditemnumber),
    FOREIGN KEY(proposeditemnumber) REFERENCES Item(itemnumber),
    FOREIGN KEY(desireditemnumber) REFERENCES Item(itemnumber)
 
   );


CREATE TABLE Platform (
    platformID INTEGER NOT NULL AUTO_INCREMENT,
    platformname VARCHAR(50) NOT NULL,
    PRIMARY KEY (platformID)
    );

CREATE TABLE VideoGame (
    itemnumber INTEGER NOT NULL,
    platformID INTEGER NOT NULL,
    media VARCHAR(12) NOT NULL,
    PRIMARY KEY (itemnumber),
    FOREIGN KEY (itemnumber) REFERENCES Item(itemnumber),
    FOREIGN KEY (platformID) REFERENCES Platform(platformID)
    );


CREATE TABLE ComputerGame (
	itemnumber INTEGER NOT NULL,
	platform varchar(7) NOT NULL,
	PRIMARY KEY (itemnumber),
	FOREIGN KEY (itemnumber) REFERENCES Item(itemnumber)
);
 
CREATE TABLE JigsawPuzzle (
	itemnumber INTEGER NOT NULL,
	piececount INTEGER NOT NULL,
	PRIMARY KEY (itemnumber),
	FOREIGN KEY (itemnumber) REFERENCES Item(itemnumber)
);
