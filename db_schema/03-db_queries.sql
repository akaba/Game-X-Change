-- haversine formula
SET @lat1= 38.8976;
SET @lon1= -77.0366;
SET @lat2= 39.9496;
SET @lon2= -75.1503;
SET @Dlat = @lat2 - @lat1;
SET @Dlon = @lon2 - @lon1;

-- a = sin²(Δlat/2) + cos(lat1) *cos(lat2) *sin²(Δlon/2)
SET @a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2);

-- c = 2 * atan2(√a, √(1−a))
SET @c := 2 * ATAN2(SQRT(@a), SQRT(1-@a));

-- d = R * c
SET @D := ROUND(6371 * 0.621371*@c, 2) ;
                                
SELECT  @D



-- My Ratings 
SELECT Round(AVG(rating),2) as rating FROM 
(
	SELECT proposeditemnumber as itemnumber, proposerrating as rating
	FROM swap
	UNION ALL
	SELECT desireditemnumber as itemnumber, counterpartyrating as rating
	FROM swap
) Table1
WHERE
rating is NOT NULL and itemnumber IN (SELECT itemnumber FROM item WHERE email = '')

-- Unaccepted swaps 
SELECT proposeditemnumber,desireditemnumber, DATEDIFF(CURDATE(),proposeddate) as days
FROM swap
WHERE 
desireditemnumber IN (SELECT itemnumber FROM item WHERE email = '')
AND swapstatus ='proposed'

-- Unrated swaps 
SELECT proposeditemnumber,desireditemnumber
FROM swap
WHERE 
(
proposerrating is NULL and proposeditemnumber IN (SELECT itemnumber FROM item WHERE email = '')
or counterpartyrating is NULL and desireditemnumber IN (SELECT itemnumber FROM item WHERE email = '')
)
AND
swapstatus ='accepted'
 
