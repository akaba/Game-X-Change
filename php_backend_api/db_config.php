<?php
	// Database Connection
	class DbConnect {
		private $server = 'localhost';
		private $dbname = 'myDatabase';
		private $user = 'myUser';
		private $pass = 'myPass@2022';
		
		public $connection;

		public function connect() {
			
			$this->connection = null;

			try {
			$this->connection = new PDO('mysql:host=' .$this->server .';dbname=' . $this->dbname, $this->user, $this->pass);
			$this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->connection->exec("set names utf8");
			} catch (\Exception $e) {
			echo "Database Error: " . $e->getMessage();
			}

			return $this->connection;

		}        
	}
?>
