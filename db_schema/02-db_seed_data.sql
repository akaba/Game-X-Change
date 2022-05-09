INSERT INTO user (email,postalcode,password,firstname,lastname,nickname)
VALUES
('akaba7@gatech.edu','07309','123','Ali','Kaba','akaba7'),
('amiles39@gatech.edu','20227','123','Austin','Miles','amiles39'),
('jennakim@gatech.edu','14043','123','Jeung Ah','Kim','jennakim'),
('mweiner30@gatech.edu','15278','123','Meir','Weiner','mweiner30'),
('xyu387@gatech.edu','00623','123','Xiao Xiang','Yu','xyu387')

INSERT INTO item (email,name,gametype,itemcondition)
VALUES
('akaba7@gatech.edu','Tetris','Video game','Lighhtly used'),
('akaba7@gatech.edu','Monopoly','Board game','Damaged/Missing parts'),
('akaba7@gatech.edu','UNO','Card game','Mint'),
('akaba7@gatech.edu','Sushi','Jigsaw puzzle','Like New'),
('akaba7@gatech.edu','Myst','Computer game','Moderately used'),
('akaba7@gatech.edu','Hearts','Card game','Lighhtly used'),
('akaba7@gatech.edu','Axis & Allies','Card game','Like New'),
('akaba7@gatech.edu','Senet','Board game','Moderately used'),
('akaba7@gatech.edu','Hounds and Jackals','Board game','Damaged/Missing parts'),
('akaba7@gatech.edu','Jigsaw Planet','Jigsaw puzzle','used'),
('akaba7@gatech.edu','National Geographic','Jigsaw puzzle','Like New'),
('mweiner30@gatech.edu','Call of Duty','Board game','Moderately used'),
('mweiner30@gatech.edu','Solitaire','Card game','Moderately used'),
('amiles39@gatech.edu','Poker','Card game','Mint'),
('amiles39@gatech.edu','War','Card game','Like New'),
('jennakim@gatech.edu','Blackjack','Card game','Lighhtly used'),
('jennakim@gatech.edu','Battleship','Board game','Damaged/Missing parts'),
('xyu387@gatech.edu','Clue','Board game','Like New'),
('xyu387@gatech.edu','Candy Land','Board game','Mint'),
('xyu387@gatech.edu','The lord of the rings','Board game','Mint'),
('mweiner30@gatech.edu','Jigidi','Jigsaw puzzle','Mint'),
('mweiner30@gatech.edu','Crazy4Jigsaws','Jigsaw puzzle','Like New')

INSERT INTO swap (proposeditemnumber,desireditemnumber,proposeddate,swapstatus,statusdate,proposerrating,counterpartyrating)
VALUES
(12,1,'2022-3-10','proposed',NULL,NULL,NULL),
(13,2,'2022-3-10','proposed',NULL,NULL,NULL),
(14,3,'2022-3-10','completed','2022-3-19',4,5),
(15,4,'2022-3-10','rejected','2022-3-11',NULL,NULL),
(4,15,'2022-3-15','completed','2022-3-21',0,3),
(16,5,'2022-3-10','accepted','2022-3-13',NULL,NULL),
(17,6,'2022-3-10','accepted','2022-3-17',NULL,3),
(7,18,'2022-3-16','completed','2022-3-21',1,3),
(8,10,'2022-3-16','proposed',NULL,NULL,NULL),
(9,20,'2022-3-17','accepted','2022-3-18',NULL,3),
(21,10,'2022-3-17','accepted','2022-3-20',NULL,NULL),
(11,22,'2022-3-17','accepted','2022-3-21',NULL,NULL)

INSERT INTO platform (platformID, platformname)
VALUES
(1,'Nintendo'),
(2,'PlayStation'),
(3,'Xbox')



