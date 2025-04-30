-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: otakuscope
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anime`
--

DROP TABLE IF EXISTS `anime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anime` (
  `id` int NOT NULL,
  `title_romaji` varchar(255) NOT NULL,
  `title_english` varchar(255) DEFAULT NULL,
  `title_native` varchar(255) DEFAULT NULL,
  `description` text,
  `genres` varchar(255) DEFAULT NULL,
  `average_score` int DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anime`
--

LOCK TABLES `anime` WRITE;
/*!40000 ALTER TABLE `anime` DISABLE KEYS */;
INSERT INTO `anime` VALUES (1,'Fullmetal Alchemist: Brotherhood','Fullmetal Alchemist: Brotherhood','鋼の錬金術師','Two brothers search for the Philosopher’s Stone...','Action,Adventure,Fantasy',95,'/covers/fmab.jpg','2009-04-05'),(2,'Death Note','Death Note','デスノート','A notebook that kills anyone whose name is written in it...','Mystery,Supernatural,Thriller',89,'/covers/deathnote.jpg','2006-10-04'),(3,'Naruto','Naruto','ナルト','A young ninja strives to become Hokage...','Action,Adventure',80,'/covers/naruto.jpg','2002-10-03'),(4,'Your Lie in April','Your Lie in April','四月は君の嘘','A piano prodigy rediscovers music thanks to a free-spirited violinist...','Drama,Music,Romance',85,'/covers/your_lie.jpg','2014-10-10'),(5,'Spirited Away','Spirited Away','千と千尋の神隠し','A girl becomes trapped in a spirit world...','Fantasy,Adventure',96,'/covers/spirited.jpg','2001-07-20');
/*!40000 ALTER TABLE `anime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anime_details`
--

DROP TABLE IF EXISTS `anime_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anime_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `anime_id` int NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT '0',
  `score` tinyint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`anime_id`),
  CONSTRAINT `anime_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `anime_details_chk_1` CHECK (((`score` is null) or (`score` between 1 and 10)))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anime_details`
--

LOCK TABLES `anime_details` WRITE;
/*!40000 ALTER TABLE `anime_details` DISABLE KEYS */;
INSERT INTO `anime_details` VALUES (1,1,1,'Watching',0,5,'2025-04-29 12:08:54'),(2,1,2,'Watched',1,10,'2025-04-27 22:05:56'),(3,1,3,'Plan to Watch',0,NULL,'2025-04-27 22:05:56'),(4,1,4,'Watching',1,9,'2025-04-27 22:05:56'),(5,1,5,'Watched',1,8,'2025-04-29 05:09:43'),(6,2,1,'Watched',1,9,'2025-04-27 22:05:56'),(7,2,3,'Watching',0,7,'2025-04-27 22:05:56'),(11,1,185736,'Watching',1,7,'2025-04-29 06:08:23'),(15,1,21,'Watched',1,7,'2025-04-29 12:36:56');
/*!40000 ALTER TABLE `anime_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anime_lists`
--

DROP TABLE IF EXISTS `anime_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anime_lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `list_id` int NOT NULL,
  `anime_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_list_anime` (`list_id`,`anime_id`),
  CONSTRAINT `anime_lists_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anime_lists`
--

LOCK TABLES `anime_lists` WRITE;
/*!40000 ALTER TABLE `anime_lists` DISABLE KEYS */;
INSERT INTO `anime_lists` VALUES (20,11,191788,'2025-04-29 22:57:02'),(21,11,21,'2025-04-29 22:58:54');
/*!40000 ALTER TABLE `anime_lists` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_anime_lists_insert` AFTER INSERT ON `anime_lists` FOR EACH ROW BEGIN
  UPDATE lists
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.list_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_anime_lists_update` AFTER UPDATE ON `anime_lists` FOR EACH ROW BEGIN
  UPDATE lists
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.list_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_anime_lists_delete` AFTER DELETE ON `anime_lists` FOR EACH ROW BEGIN
  UPDATE lists
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.list_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `anime_reviews`
--

DROP TABLE IF EXISTS `anime_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anime_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `anime_id` int NOT NULL,
  `review_title` varchar(255) NOT NULL,
  `review_content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`anime_id`),
  CONSTRAINT `anime_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anime_reviews`
--

LOCK TABLES `anime_reviews` WRITE;
/*!40000 ALTER TABLE `anime_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `anime_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edited` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,2,'Fullmetal Alchemist is the GOAT!','2025-04-27 22:06:31','2025-04-27 22:06:31'),(2,2,1,'Yes—such a beautiful film.','2025-04-27 22:06:31','2025-04-27 22:06:31');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `anime_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `anime_id` (`anime_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (4,1,2),(5,1,4),(6,2,1);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_post_tags`
--

DROP TABLE IF EXISTS `forum_post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_post_tags` (
  `post_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `forum_post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`id`),
  CONSTRAINT `forum_post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `forum_tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_post_tags`
--

LOCK TABLES `forum_post_tags` WRITE;
/*!40000 ALTER TABLE `forum_post_tags` DISABLE KEYS */;
INSERT INTO `forum_post_tags` VALUES (1,2),(2,3);
/*!40000 ALTER TABLE `forum_post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_posts`
--

DROP TABLE IF EXISTS `forum_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edited` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `forum_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_posts`
--

LOCK TABLES `forum_posts` WRITE;
/*!40000 ALTER TABLE `forum_posts` DISABLE KEYS */;
INSERT INTO `forum_posts` VALUES (1,1,'Best action anime?','What are your favorite action titles?','2025-04-27 22:06:18','2025-04-27 22:06:18'),(2,2,'Anyone watched Spirited Away?','Absolutely loved it, thoughts?','2025-04-27 22:06:18','2025-04-27 22:06:18');
/*!40000 ALTER TABLE `forum_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_tags`
--

DROP TABLE IF EXISTS `forum_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_tags`
--

LOCK TABLES `forum_tags` WRITE;
/*!40000 ALTER TABLE `forum_tags` DISABLE KEYS */;
INSERT INTO `forum_tags` VALUES (1,'Discussion'),(2,'Recommendation'),(3,'Review');
/*!40000 ALTER TABLE `forum_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lists`
--

LOCK TABLES `lists` WRITE;
/*!40000 ALTER TABLE `lists` DISABLE KEYS */;
INSERT INTO `lists` VALUES (11,7,'fav','2025-04-29 22:57:01','2025-04-29 22:58:54'),(12,7,'dsf','2025-04-29 22:58:51','2025-04-29 22:58:51');
/*!40000 ALTER TABLE `lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `myanime`
--

DROP TABLE IF EXISTS `myanime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `myanime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `anime_id` int NOT NULL,
  `status` enum('Plan to Watch','Watching','Watched') NOT NULL,
  `score` int DEFAULT NULL,
  `review` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `anime_id` (`anime_id`),
  CONSTRAINT `myanime_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `myanime_ibfk_2` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `myanime`
--

LOCK TABLES `myanime` WRITE;
/*!40000 ALTER TABLE `myanime` DISABLE KEYS */;
/*!40000 ALTER TABLE `myanime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('Comment','Reply','Review') NOT NULL,
  `reference_id` int NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'Comment',1,0,'2025-04-27 22:06:34'),(2,2,'Reply',2,1,'2025-04-27 22:06:34'),(3,1,'Comment',1,0,'2025-04-27 22:06:37'),(4,2,'Reply',2,1,'2025-04-27 22:06:37');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'fazzyboo','faiyaz@gmail.com','$2b$10$c/tw1teYyXa/9qVWliVaoemV.9ucCZqLgEx00ajVPk59Lrqbx1Ti2',NULL,'2025-04-27 12:02:59'),(2,'faiyaz','faiyazabrar@gmail.com','$2b$10$311Fu32zPo20nbD693nFUu3FmxsP3qUepoK8ad3j29T5Zmo83ZPFu',NULL,'2025-04-27 18:43:31'),(5,'faiyaz.abr','faiyaz.abr@gmail.com','faiyaz12345','/images/faiyaz.jpg','2025-04-27 22:05:34'),(6,'alice','alice@gmail.com','faiyaz12345','/images/alice.png','2025-04-27 22:05:34'),(7,'rdbms@gmail.com','rdbms@gmail.com','$2b$10$imJSAyS44LPGwju0lEzSs.Er5hnrUQwtblqb5cVgLbIUGHcDqXFPa',NULL,'2025-04-29 23:18:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'otakuscope'
--

--
-- Dumping routines for database 'otakuscope'
--
/*!50003 DROP FUNCTION IF EXISTS `GetUserAnimeListCountFn` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserAnimeListCountFn`(user_id_param INT) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE total_anime_count INT;

    SELECT COUNT(DISTINCT ad.anime_id)
    INTO total_anime_count
    FROM anime_details ad
    WHERE ad.user_id = user_id_param;

    RETURN total_anime_count;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `GetUserFavoritesCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserFavoritesCount`(user_id_param INT) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE fav_count INT;

    SELECT COUNT(*) INTO fav_count
    FROM anime_details
    WHERE user_id = user_id_param
      AND is_favorite = TRUE;

    RETURN fav_count;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `GetUserWatchedCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserWatchedCount`(user_id_param INT) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE watched_anime_count INT;

    SELECT COUNT(DISTINCT ad.anime_id)
    INTO watched_anime_count
    FROM anime_details ad
    WHERE ad.user_id = user_id_param
      AND ad.status = 'Watching';

    RETURN watched_anime_count;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `GetUserWatchingCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserWatchingCount`(user_id_param INT) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE watching_count INT;

    SELECT COUNT(DISTINCT ad.anime_id)
    INTO watching_count
    FROM anime_details ad
    WHERE ad.user_id = user_id_param
      AND ad.status = 'Watching';

    RETURN watching_count;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetCurrentlyWatching` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCurrentlyWatching`(IN uid INT)
BEGIN
  SELECT
    a.title_romaji,
    a.title_english,
    a.cover_image
  FROM anime_details ad
  JOIN anime a ON ad.anime_id = a.id
  WHERE ad.user_id = uid
    AND ad.status = 'Watching';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetFavoriteAnimes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFavoriteAnimes`(IN uid INT)
BEGIN
  SELECT
		a.title_romaji,
		a.title_english,
		a.cover_image
	FROM anime_details ad
	JOIN anime a ON ad.anime_id = a.id
	WHERE ad.user_id = uid
	  AND ad.is_favorite = TRUE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserAnimeListCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserAnimeListCount`(IN user_id_param INT)
BEGIN
    SELECT COUNT(DISTINCT ad.anime_id) AS total_anime_count
    FROM anime_details ad
    WHERE ad.user_id = user_id_param;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserAnimeStatusPercentages` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserAnimeStatusPercentages`(IN user_id_param INT)
BEGIN
    DECLARE total_count INT DEFAULT 0;
    DECLARE watched_count INT DEFAULT 0;
    DECLARE watching_count INT DEFAULT 0;
    DECLARE plan_to_watch_count INT DEFAULT 0;
    
    SELECT COUNT(DISTINCT anime_id) INTO total_count
    FROM anime_details
    WHERE user_id = user_id_param;
    
    SELECT COUNT(DISTINCT anime_id) INTO watched_count
    FROM anime_details
    WHERE user_id = user_id_param
      AND status = 'Watched';
      
    SELECT COUNT(DISTINCT anime_id) INTO watching_count
    FROM anime_details
    WHERE user_id = user_id_param
      AND status = 'Watching';
    
    SELECT COUNT(DISTINCT anime_id) INTO plan_to_watch_count
    FROM anime_details
    WHERE user_id = user_id_param
      AND status = 'Plan to Watch';
      
    SELECT 
        IF(total_count = 0, 0, ROUND((watched_count / total_count) * 100, 2)) AS watched_percentage,
        IF(total_count = 0, 0, ROUND((watching_count / total_count) * 100, 2)) AS watching_percentage,
        IF(total_count = 0, 0, ROUND((plan_to_watch_count / total_count) * 100, 2)) AS plan_to_watch_percentage;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserFavoritesCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserFavoritesCount`(IN user_id_param INT)
BEGIN
    SELECT COUNT(*) AS favorites_count
    FROM favorites
    WHERE user_id = user_id_param;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserWatchedCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserWatchedCount`(IN user_id_param INT)
BEGIN
    SELECT COUNT(DISTINCT ad.anime_id) AS watched_anime_count
    FROM anime_details ad
    WHERE ad.user_id = user_id_param
      AND ad.status = 'Watching';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserWatchingCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserWatchingCount`(IN user_id_param INT)
BEGIN
    SELECT COUNT(DISTINCT ad.anime_id) AS watching_anime_count
    FROM anime_details ad
    WHERE ad.user_id = user_id_param
	  AND ad.status = 'Watching';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-30  5:23:12
