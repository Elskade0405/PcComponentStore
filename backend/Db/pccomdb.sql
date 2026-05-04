CREATE DATABASE IF NOT EXISTS pccomdb;
USE pccomdb;

-- 1. USERS
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `role_type` varchar(50) DEFAULT 'customer',
  `attributes` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO `users` (`username`, `password_hash`, `email`, `phone_number`, `role_type`, `attributes`) VALUES
('Admin', 'hashed_pwd_3', 'admin@pcstore.com', '0123456789', 'admin', '{}');

-- 2. CPU
CREATE TABLE IF NOT EXISTS `cpu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cpu_name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `cpu` (`cpu_name`, `brand`, `price`, `stock`, `attributes`) VALUES
('Intel Core i9 14900K', 'Intel', 15990000, 10, '{"socket": "LGA 1700", "cores": 24, "threads": 32, "baseClock": "3.2 GHz", "boostClock": "6.0 GHz", "cache": "36MB", "tdp": "125W"}'),
('Intel Core i7 14700K', 'Intel', 11500000, 15, '{"socket": "LGA 1700", "cores": 20, "threads": 28, "baseClock": "3.4 GHz", "boostClock": "5.6 GHz", "cache": "33MB", "tdp": "125W"}'),
('Intel Core i5 13400F', 'Intel', 5200000, 30, '{"socket": "LGA 1700", "cores": 10, "threads": 16, "baseClock": "2.5 GHz", "boostClock": "4.6 GHz", "cache": "20MB", "tdp": "65W"}'),
('AMD Ryzen 9 7950X', 'AMD', 16500000, 8, '{"socket": "AM5", "cores": 16, "threads": 32, "baseClock": "4.5 GHz", "boostClock": "5.7 GHz", "cache": "64MB", "tdp": "170W"}'),
('AMD Ryzen 7 7800X3D', 'AMD', 10500000, 20, '{"socket": "AM5", "cores": 8, "threads": 16, "baseClock": "4.2 GHz", "boostClock": "5.0 GHz", "cache": "96MB", "tdp": "120W"}');

-- 3. MAINBOARD
CREATE TABLE IF NOT EXISTS `main` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `main` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('ASUS ROG MAXIMUS Z790 HERO', 'ASUS', 17000000, 5, '{"socket": "LGA 1700", "chipset": "Z790", "size": "ATX", "ramSupport": "DDR5"}'),
('MSI MAG B760M MORTAR WIFI', 'MSI', 4500000, 25, '{"socket": "LGA 1700", "chipset": "B760", "size": "mATX", "ramSupport": "DDR5"}'),
('GIGABYTE X670E AORUS MASTER', 'GIGABYTE', 14200000, 7, '{"socket": "AM5", "chipset": "X670E", "size": "E-ATX", "ramSupport": "DDR5"}'),
('ASROCK B650M Pro RS', 'ASROCK', 3800000, 40, '{"socket": "AM5", "chipset": "B650", "size": "mATX", "ramSupport": "DDR5"}');

-- 4. VGA
CREATE TABLE IF NOT EXISTS `vga` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `vga` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('ASUS ROG Strix GeForce RTX 4090 24GB', 'ASUS', 65000000, 3, '{"vram": "24GB GDDR6X", "gpu": "RTX 4090", "power": "1000W"}'),
('MSI GeForce RTX 4070 Ti SUPER 16G', 'MSI', 24500000, 10, '{"vram": "16GB GDDR6X", "gpu": "RTX 4070 Ti SUPER", "power": "750W"}'),
('GIGABYTE GeForce RTX 3060 12GB', 'GIGABYTE', 7500000, 50, '{"vram": "12GB GDDR6", "gpu": "RTX 3060", "power": "550W"}'),
('ASUS TUF Gaming Radeon RX 7900 XTX', 'ASUS', 28000000, 6, '{"vram": "24GB GDDR6", "gpu": "RX 7900 XTX", "power": "850W"}');

-- 5. RAM
CREATE TABLE IF NOT EXISTS `ram` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `ram` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', 'Corsair', 3500000, 40, '{"memory": "32GB", "type": "DDR5", "bus": "6000MHz"}'),
('G.Skill Trident Z5 Neo RGB 64GB (2x32GB) DDR5', 'G.Skill', 7200000, 15, '{"memory": "64GB", "type": "DDR5", "bus": "6000MHz"}'),
('Kingston Fury Beast 16GB DDR4 3200MHz', 'Kingston', 1100000, 100, '{"memory": "16GB", "type": "DDR4", "bus": "3200MHz"}');

-- 6. STORAGE
CREATE TABLE IF NOT EXISTS `storage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `storage` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('Samsung 990 PRO 2TB PCIe 4.0 NVMe', 'Samsung', 5500000, 20, '{"type": "SSD", "capacity": "2TB", "interface": "PCIe 4.0"}'),
('WD Black SN850X 1TB', 'Western Digital', 2800000, 35, '{"type": "SSD", "capacity": "1TB", "interface": "PCIe 4.0"}'),
('Seagate Barracuda 2TB 7200RPM', 'Seagate', 1500000, 50, '{"type": "HDD", "capacity": "2TB", "interface": "SATA III"}');

-- 7. PSU
CREATE TABLE IF NOT EXISTS `psu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `psu` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('Corsair RM1000x 1000W 80 Plus Gold', 'Corsair', 4500000, 12, '{"capacity": "1000W", "efficiency": "80 Plus Gold", "modular": "Full"}'),
('ASUS ROG Strix 850W Gold', 'ASUS', 3800000, 18, '{"capacity": "850W", "efficiency": "80 Plus Gold", "modular": "Full"}'),
('Cooler Master MWE 650 Bronze V2', 'Cooler Master', 1400000, 45, '{"capacity": "650W", "efficiency": "80 Plus Bronze", "modular": "None"}');

-- 8. CASE
CREATE TABLE IF NOT EXISTS `CASE_COMP` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `CASE_COMP` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('NZXT H9 Flow Dual-Chamber', 'NZXT', 4200000, 10, '{"type": "Mid Tower", "color": "Black", "glass": "Yes"}'),
('Lian Li O11 Dynamic EVO', 'Lian Li', 3900000, 15, '{"type": "Mid Tower", "color": "White", "glass": "Yes"}'),
('Deepcool CH560 Digital', 'Deepcool', 2500000, 25, '{"type": "Mid Tower", "color": "Black", "glass": "Yes"}');

-- 9. COOLER
CREATE TABLE IF NOT EXISTS `cooler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `cooler` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('NZXT Kraken Elite 360 RGB', 'NZXT', 7500000, 8, '{"type": "Tản nước AIO", "size": "360mm", "led": "RGB"}'),
('Deepcool AK620 Digital', 'Deepcool', 1800000, 30, '{"type": "Tản khí", "size": "Dual Tower", "led": "ARGB"}'),
('Thermalright Peerless Assassin 120 SE', 'Thermalright', 900000, 50, '{"type": "Tản khí", "size": "120mm", "led": "None"}');

-- 10. MONITOR
CREATE TABLE IF NOT EXISTS `monitor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `monitor` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('LG UltraGear 27GR95QE-B OLED 240Hz', 'LG', 22000000, 5, '{"size": "27 inch", "resolution": "2K (2560x1440)", "refresh_rate": "240Hz", "panel": "OLED"}'),
('ASUS TUF Gaming VG27AQ3A 27 inch', 'ASUS', 6500000, 25, '{"size": "27 inch", "resolution": "2K", "refresh_rate": "180Hz", "panel": "Fast IPS"}'),
('AOC 24G4 24 inch IPS 180Hz', 'AOC', 3200000, 40, '{"size": "24 inch", "resolution": "FHD", "refresh_rate": "180Hz", "panel": "IPS"}');

-- 11. MOUSE
CREATE TABLE IF NOT EXISTS `mouse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `mouse` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('Logitech G Pro X Superlight 2', 'Logitech', 3500000, 15, '{"type": "Wireless", "dpi": "32000", "weight": "60g"}'),
('Razer DeathAdder V3 Pro', 'Razer', 3300000, 10, '{"type": "Wireless", "dpi": "30000", "weight": "63g"}'),
('Logitech G102 Lightsync', 'Logitech', 450000, 100, '{"type": "Wire", "dpi": "8000", "weight": "85g"}');

-- 12. KEYBOARD
CREATE TABLE IF NOT EXISTS `keyboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `keyboard` (`name`, `brand`, `price`, `stock`, `attributes`) VALUES
('Wooting 60HE', 'Wooting', 5500000, 5, '{"type": "Wired", "size": "60%", "switch_type": "Lekker"}'),
('Akko 5075B Plus Blue on White', 'AKKO', 1900000, 25, '{"type": "Wireless", "size": "75%", "switch_type": "Linear"}'),
('Corsair K70 RGB PRO', 'Corsair', 3800000, 12, '{"type": "Wired", "size": "Full size", "switch_type": "Cherry MX Red"}');
