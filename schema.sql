CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assetTag` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Hardware','Software') NOT NULL,
  `make` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `serialNumber` varchar(255) NOT NULL,
  `processor` varchar(255) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `osVersion` varchar(255) DEFAULT NULL,
  `ram` varchar(255) DEFAULT NULL,
  `storage` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive','In Repair','Retired') NOT NULL,
  `assignedUser` varchar(255) NOT NULL,
  `remark` text,
  `warrantyStatus` enum('Active','Expired') NOT NULL,
  `warrantyExpirationDate` date DEFAULT NULL,
  `purchaseDate` date NOT NULL,
  `department` varchar(255) NOT NULL,
  `maintenanceHistory` json DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `licenseInfo` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNo` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `assets` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` datetime NOT NULL,
  `user` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `details` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

