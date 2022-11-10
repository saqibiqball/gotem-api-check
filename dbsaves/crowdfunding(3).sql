-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2022 at 08:16 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crowdfunding`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmarked_missions`
--

CREATE TABLE `bookmarked_missions` (
  `id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `missionId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bookmarked_users`
--

CREATE TABLE `bookmarked_users` (
  `id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `userBookmarkId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT '',
  `slug` varchar(255) DEFAULT '',
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chats_private`
--

CREATE TABLE `chats_private` (
  `id` int(11) NOT NULL,
  `lastMessage` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `senderId` int(11) DEFAULT NULL,
  `receiverId` int(11) DEFAULT NULL,
  `lastMessageOwnerId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chats_private`
--

INSERT INTO `chats_private` (`id`, `lastMessage`, `createdAt`, `updatedAt`, `senderId`, `receiverId`, `lastMessageOwnerId`) VALUES
(1, 'ok wait a minute ', '2022-10-13 14:05:19', '2022-10-13 14:07:55', 5, 6, 6),
(2, 'yes i am able to do it.', '2022-10-15 07:08:24', '2022-10-15 07:11:25', 4, 6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `disputes`
--

CREATE TABLE `disputes` (
  `id` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `reason` varchar(255) DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `milestoneId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `evidences`
--

CREATE TABLE `evidences` (
  `id` int(11) NOT NULL,
  `title` varchar(500) DEFAULT '',
  `description` text DEFAULT NULL,
  `submissionDate` datetime DEFAULT NULL,
  `activationLink` varchar(255) DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `milestoneId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `evidences_files`
--

CREATE TABLE `evidences_files` (
  `id` int(11) NOT NULL,
  `name` varchar(755) DEFAULT '',
  `evidenceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `globalsettings`
--

CREATE TABLE `globalsettings` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT '',
  `value` varchar(255) DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `chatPrivateId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `content`, `isRead`, `createdAt`, `updatedAt`, `userId`, `chatPrivateId`) VALUES
(1, 'take a look on the mission see if you can do it?', 1, '2022-10-13 14:05:19', '2022-10-15 09:19:00', 5, 1),
(2, 'ok wait a minute ', 1, '2022-10-13 14:07:55', '2022-10-13 14:11:51', 6, 1),
(3, 'i am admin is that you are eligible for this mission please describe how do you perform this mission.', 1, '2022-10-15 07:08:24', '2022-10-15 09:19:00', 4, 2),
(4, 'yes i am able to do it.', 1, '2022-10-15 07:11:25', '2022-10-17 08:52:11', 6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `messages_group`
--

CREATE TABLE `messages_group` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `senderId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages_group`
--

INSERT INTO `messages_group` (`id`, `content`, `createdAt`, `updatedAt`, `senderId`) VALUES
(1, 'test', '2022-10-13 09:59:01', '2022-10-13 09:59:01', 5);

-- --------------------------------------------------------

--
-- Table structure for table `milestones`
--

CREATE TABLE `milestones` (
  `id` int(11) NOT NULL,
  `title` varchar(500) DEFAULT '',
  `description` text DEFAULT NULL,
  `amount` float DEFAULT 0,
  `dueDate` datetime DEFAULT NULL,
  `isDueDate` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `statusId` int(11) DEFAULT NULL,
  `paymentStatusId` int(11) DEFAULT NULL,
  `proposalsId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `milestone_payment_statuses`
--

CREATE TABLE `milestone_payment_statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `milestone_statuses`
--

CREATE TABLE `milestone_statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `missions`
--

CREATE TABLE `missions` (
  `id` int(11) NOT NULL,
  `title` varchar(1000) DEFAULT '',
  `type` varchar(2000) DEFAULT '',
  `description` text DEFAULT NULL,
  `objectives` text DEFAULT NULL,
  `activationLink` varchar(255) DEFAULT '',
  `location` varchar(255) DEFAULT '',
  `country` varchar(255) DEFAULT '',
  `countryShortName` varchar(20) DEFAULT '',
  `city` varchar(255) DEFAULT '',
  `administartiveArea` varchar(255) DEFAULT '',
  `locationLat` float DEFAULT 0,
  `locationLng` float DEFAULT 0,
  `estimatedBudget` float DEFAULT 0,
  `deadline` datetime DEFAULT NULL,
  `isTrending` tinyint(1) DEFAULT 0,
  `isRemote` tinyint(1) DEFAULT 0,
  `isUrgent` tinyint(1) DEFAULT 0,
  `isPrivacy` tinyint(1) DEFAULT 0,
  `isAttachmentsPublic` tinyint(1) DEFAULT 0,
  `isMultipleSource` tinyint(1) DEFAULT 0,
  `crowdfundingMin` float DEFAULT 0,
  `crowdfundingMax` float DEFAULT 0,
  `rating` float DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `budgetId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `missionFundingTypeId` int(11) DEFAULT NULL,
  `missionTypeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `missions`
--

INSERT INTO `missions` (`id`, `title`, `type`, `description`, `objectives`, `activationLink`, `location`, `country`, `countryShortName`, `city`, `administartiveArea`, `locationLat`, `locationLng`, `estimatedBudget`, `deadline`, `isTrending`, `isRemote`, `isUrgent`, `isPrivacy`, `isAttachmentsPublic`, `isMultipleSource`, `crowdfundingMin`, `crowdfundingMax`, `rating`, `createdAt`, `updatedAt`, `budgetId`, `userId`, `missionFundingTypeId`, `missionTypeId`) VALUES
(2, 'test Mission', '', 'test something ', 'test something', 'fc97f33d-3f1a-4b48-82d3-ebff84b79017', 'Arad, Romania', 'Romania', 'RO', 'Arad', 'AR', 46.1866, 21.3123, 1, '2022-10-31 13:59:52', 0, 1, 1, 0, 0, 0, 0, 0, 0, '2022-10-13 14:01:58', '2022-10-13 14:01:58', NULL, 5, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `missions_applicants`
--

CREATE TABLE `missions_applicants` (
  `id` int(11) NOT NULL,
  `isWinner` tinyint(1) DEFAULT 0,
  `missionId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `missions_categories`
--

CREATE TABLE `missions_categories` (
  `id` int(11) NOT NULL,
  `missionId` int(11) DEFAULT NULL,
  `catId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `missions_funding_type`
--

CREATE TABLE `missions_funding_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `missions_funding_type`
--

INSERT INTO `missions_funding_type` (`id`, `name`) VALUES
(1, 'Private funds'),
(2, 'Crowdfunded');

-- --------------------------------------------------------

--
-- Table structure for table `missions_type`
--

CREATE TABLE `missions_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `missions_type`
--

INSERT INTO `missions_type` (`id`, `name`) VALUES
(1, 'Public'),
(2, 'Private');

-- --------------------------------------------------------

--
-- Table structure for table `mission_budget`
--

CREATE TABLE `mission_budget` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `mission_files`
--

CREATE TABLE `mission_files` (
  `id` int(11) NOT NULL,
  `name` varchar(755) DEFAULT '',
  `missionId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mission_files`
--

INSERT INTO `mission_files` (`id`, `name`, `missionId`) VALUES
(1, '0a94b15b-d6e3-4d5d-a231-f6e327e49956/fc97f33d-3f1a-4b48-82d3-ebff84b79017/b.jpg', 2);

-- --------------------------------------------------------

--
-- Table structure for table `proposals`
--

CREATE TABLE `proposals` (
  `id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` float DEFAULT 0,
  `retainerAmount` float DEFAULT 0,
  `isFixedPrice` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `statusId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `missionId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `proposals`
--

INSERT INTO `proposals` (`id`, `description`, `amount`, `retainerAmount`, `isFixedPrice`, `createdAt`, `updatedAt`, `statusId`, `userId`, `missionId`) VALUES
(12, 'fixed price mission for my lost lens', 1000, 100, 1, '2022-10-15 06:48:41', '2022-10-15 07:09:29', 2, 6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `proposal_statuses`
--

CREATE TABLE `proposal_statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `proposal_statuses`
--

INSERT INTO `proposal_statuses` (`id`, `name`) VALUES
(1, 'Suspend'),
(2, 'Active'),
(3, 'Reject'),
(4, 'Done'),
(5, 'Archive');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `orderId` varchar(255) DEFAULT '',
  `status` varchar(255) DEFAULT '',
  `currency` varchar(255) DEFAULT '',
  `description` text DEFAULT NULL,
  `amount` float DEFAULT 0,
  `marketplaceCommission` float DEFAULT 0,
  `userAmount` float DEFAULT 0,
  `pendingBalance` float DEFAULT 0,
  `availableBalance` float DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `milestoneId` int(11) DEFAULT NULL,
  `userPaidId` int(11) DEFAULT NULL,
  `userReceivedId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `orderId`, `status`, `currency`, `description`, `amount`, `marketplaceCommission`, `userAmount`, `pendingBalance`, `availableBalance`, `createdAt`, `updatedAt`, `milestoneId`, `userPaidId`, `userReceivedId`) VALUES
(1, '', 'payout', 'usd', '', -100, 0, -100, 0, -100, '2022-10-13 09:47:39', '2022-10-13 09:47:39', NULL, 4, 6),
(2, '', 'payout', 'usd', '', -6666, 0, -6666, 0, -6766, '2022-10-14 12:37:36', '2022-10-14 12:37:36', NULL, 4, 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nickName` varchar(255) DEFAULT '',
  `photo` varchar(255) DEFAULT 'avatar.png',
  `firstName` varchar(255) DEFAULT '',
  `lastName` varchar(255) DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `location` varchar(255) DEFAULT '',
  `country` varchar(255) DEFAULT '',
  `countryShortName` varchar(20) DEFAULT '',
  `city` varchar(255) DEFAULT '',
  `administartiveArea` varchar(255) DEFAULT '',
  `locationLat` float DEFAULT 0,
  `locationLng` float DEFAULT 0,
  `password` varchar(255) DEFAULT '',
  `bio` varchar(1000) DEFAULT '',
  `jobTitle` varchar(255) DEFAULT '',
  `alternativeEmail` varchar(255) DEFAULT '',
  `showJobTitle` tinyint(1) DEFAULT 0,
  `slug` varchar(255) DEFAULT '',
  `activationLink` varchar(255) DEFAULT '',
  `confirmEmail` tinyint(1) DEFAULT 0,
  `rating` float DEFAULT 0,
  `countReviews` int(11) NOT NULL DEFAULT 0,
  `hourlyRate` float DEFAULT 0,
  `userLicense` varchar(255) DEFAULT '',
  `preferredPaymentMethod` varchar(255) DEFAULT '',
  `paypalEmail` varchar(255) DEFAULT '',
  `payoneerEmail` varchar(255) DEFAULT '',
  `swift` varchar(255) DEFAULT '',
  `nameOfBank` varchar(500) DEFAULT '',
  `countryOfBank` varchar(255) DEFAULT '',
  `streetOfBank` varchar(255) DEFAULT '',
  `cityOfBank` varchar(255) DEFAULT '',
  `zipOfBank` varchar(255) DEFAULT '',
  `iban` varchar(255) DEFAULT '',
  `accountName` varchar(255) DEFAULT '',
  `customerId` varchar(255) DEFAULT '',
  `pendingBalance` float DEFAULT 0,
  `availableBalance` float DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `roleId` int(11) DEFAULT NULL,
  `statusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nickName`, `photo`, `firstName`, `lastName`, `email`, `location`, `country`, `countryShortName`, `city`, `administartiveArea`, `locationLat`, `locationLng`, `password`, `bio`, `jobTitle`, `alternativeEmail`, `showJobTitle`, `slug`, `activationLink`, `confirmEmail`, `rating`, `countReviews`, `hourlyRate`, `userLicense`, `preferredPaymentMethod`, `paypalEmail`, `payoneerEmail`, `swift`, `nameOfBank`, `countryOfBank`, `streetOfBank`, `cityOfBank`, `zipOfBank`, `iban`, `accountName`, `customerId`, `pendingBalance`, `availableBalance`, `createdAt`, `updatedAt`, `roleId`, `statusId`) VALUES
(4, 'admin', '187451be-f8a1-4e34-9fcc-e37a11658d01/4d3034f0-8fa4-4d1d-a232-864020fe4208.jpg', 'admin', 'admin', 'admin@gotem.com', 'United States', 'United States', 'US', '', '', 37.0902, -95.7129, 'ee4517b6f4d99e6d077be02fefbc3441c4cffb542e37e51e6d85fc5f98bd4e54', '', '', '', 0, 'admin', '187451be-f8a1-4e34-9fcc-e37a11658d01', 1, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, '2022-10-12 14:11:10', '2022-10-12 14:12:24', 1, 1),
(5, 'user', '0a94b15b-d6e3-4d5d-a231-f6e327e49956/d78a2be7-ddc4-4f9a-82d5-4d261c6038b7.jpg', 'user', 'user', 'user@gotem.com', 'United States', 'United States', 'US', '', '', 37.0902, -95.7129, '6defa6c94588e06e85e5f619a0fa6c7e6c9c1830ea1d879b45df420f146060ae', '', '', '', 0, 'user', '0a94b15b-d6e3-4d5d-a231-f6e327e49956', 1, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, '2022-10-12 14:44:14', '2022-10-12 14:50:59', 2, 1),
(6, 'source', '885643e4-ad84-402d-9e69-b66d983d24cb/65f7ed16-8f75-4f5f-a490-58e2aceeef88.jpeg', 'source', 'source', 'source@gotem.com', 'United States', 'United States', 'US', '', '', 37.0902, -95.7129, '0addd4fcea1062d5ec66bf11506da4359a851827307a9aa87900965b774ee174', '', '', '', 0, 'source', '885643e4-ad84-402d-9e69-b66d983d24cb', 1, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', 0, -6766, '2022-10-12 14:47:58', '2022-10-14 12:37:36', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users_categories`
--

CREATE TABLE `users_categories` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `catId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_employment`
--

CREATE TABLE `user_employment` (
  `id` int(11) NOT NULL,
  `name` varchar(455) DEFAULT '',
  `description` varchar(455) DEFAULT '',
  `isPresent` tinyint(1) DEFAULT 0,
  `monthFrom` varchar(255) DEFAULT '',
  `yearFrom` varchar(255) DEFAULT '',
  `monthTo` varchar(255) DEFAULT '',
  `yearTo` varchar(255) DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_files`
--

CREATE TABLE `user_files` (
  `id` int(11) NOT NULL,
  `name` varchar(455) DEFAULT '',
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_files2`
--

CREATE TABLE `user_files2` (
  `id` int(11) NOT NULL,
  `name` varchar(455) DEFAULT '',
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_files3`
--

CREATE TABLE `user_files3` (
  `id` int(11) NOT NULL,
  `name` varchar(455) DEFAULT '',
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_review`
--

CREATE TABLE `user_review` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `ratingLevel` float DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `missionId` int(11) DEFAULT NULL,
  `proposalId` int(11) DEFAULT NULL,
  `receiverId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT '',
  `description` varchar(500) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `name`, `description`) VALUES
(1, 'admin', ''),
(2, 'user ', ' (If you are looking to hire)'),
(3, 'source', '(If you’re providing services)');

-- --------------------------------------------------------

--
-- Table structure for table `user_skills`
--

CREATE TABLE `user_skills` (
  `id` int(11) NOT NULL,
  `name` varchar(455) DEFAULT '',
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_statuses`
--

CREATE TABLE `user_statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_statuses`
--

INSERT INTO `user_statuses` (`id`, `name`) VALUES
(1, 'Active'),
(2, 'Reject'),
(3, 'Suspend');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarked_missions`
--
ALTER TABLE `bookmarked_missions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `missionId` (`missionId`);

--
-- Indexes for table `bookmarked_users`
--
ALTER TABLE `bookmarked_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `userBookmarkId` (`userBookmarkId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `chats_private`
--
ALTER TABLE `chats_private`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `receiverId` (`receiverId`),
  ADD KEY `lastMessageOwnerId` (`lastMessageOwnerId`);

--
-- Indexes for table `disputes`
--
ALTER TABLE `disputes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `milestoneId` (`milestoneId`);

--
-- Indexes for table `evidences`
--
ALTER TABLE `evidences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `milestoneId` (`milestoneId`);

--
-- Indexes for table `evidences_files`
--
ALTER TABLE `evidences_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evidenceId` (`evidenceId`);

--
-- Indexes for table `globalsettings`
--
ALTER TABLE `globalsettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `chatPrivateId` (`chatPrivateId`);

--
-- Indexes for table `messages_group`
--
ALTER TABLE `messages_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`);

--
-- Indexes for table `milestones`
--
ALTER TABLE `milestones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `paymentStatusId` (`paymentStatusId`),
  ADD KEY `proposalsId` (`proposalsId`);

--
-- Indexes for table `milestone_payment_statuses`
--
ALTER TABLE `milestone_payment_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `milestone_statuses`
--
ALTER TABLE `milestone_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `missions`
--
ALTER TABLE `missions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `budgetId` (`budgetId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `missionFundingTypeId` (`missionFundingTypeId`),
  ADD KEY `missionTypeId` (`missionTypeId`);

--
-- Indexes for table `missions_applicants`
--
ALTER TABLE `missions_applicants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `missions_applicants_userId_missionId_unique` (`missionId`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `missions_categories`
--
ALTER TABLE `missions_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `missions_categories_catId_missionId_unique` (`missionId`,`catId`),
  ADD KEY `catId` (`catId`);

--
-- Indexes for table `missions_funding_type`
--
ALTER TABLE `missions_funding_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `missions_type`
--
ALTER TABLE `missions_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mission_budget`
--
ALTER TABLE `mission_budget`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mission_files`
--
ALTER TABLE `mission_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `missionId` (`missionId`);

--
-- Indexes for table `proposals`
--
ALTER TABLE `proposals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `statusId` (`statusId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `missionId` (`missionId`);

--
-- Indexes for table `proposal_statuses`
--
ALTER TABLE `proposal_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `milestoneId` (`milestoneId`),
  ADD KEY `userPaidId` (`userPaidId`),
  ADD KEY `userReceivedId` (`userReceivedId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nickName` (`nickName`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `roleId` (`roleId`),
  ADD KEY `statusId` (`statusId`);

--
-- Indexes for table `users_categories`
--
ALTER TABLE `users_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_categories_catId_userId_unique` (`userId`,`catId`),
  ADD KEY `catId` (`catId`);

--
-- Indexes for table `user_employment`
--
ALTER TABLE `user_employment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user_files`
--
ALTER TABLE `user_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user_files2`
--
ALTER TABLE `user_files2`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user_files3`
--
ALTER TABLE `user_files3`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user_review`
--
ALTER TABLE `user_review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `missionId` (`missionId`),
  ADD KEY `proposalId` (`proposalId`),
  ADD KEY `receiverId` (`receiverId`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user_statuses`
--
ALTER TABLE `user_statuses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarked_missions`
--
ALTER TABLE `bookmarked_missions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bookmarked_users`
--
ALTER TABLE `bookmarked_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chats_private`
--
ALTER TABLE `chats_private`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `disputes`
--
ALTER TABLE `disputes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evidences`
--
ALTER TABLE `evidences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evidences_files`
--
ALTER TABLE `evidences_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `globalsettings`
--
ALTER TABLE `globalsettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages_group`
--
ALTER TABLE `messages_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `milestones`
--
ALTER TABLE `milestones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `milestone_payment_statuses`
--
ALTER TABLE `milestone_payment_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `milestone_statuses`
--
ALTER TABLE `milestone_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missions`
--
ALTER TABLE `missions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `missions_applicants`
--
ALTER TABLE `missions_applicants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missions_categories`
--
ALTER TABLE `missions_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `missions_funding_type`
--
ALTER TABLE `missions_funding_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `missions_type`
--
ALTER TABLE `missions_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mission_budget`
--
ALTER TABLE `mission_budget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mission_files`
--
ALTER TABLE `mission_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `proposals`
--
ALTER TABLE `proposals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `proposal_statuses`
--
ALTER TABLE `proposal_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users_categories`
--
ALTER TABLE `users_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_employment`
--
ALTER TABLE `user_employment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_files`
--
ALTER TABLE `user_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_files2`
--
ALTER TABLE `user_files2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_files3`
--
ALTER TABLE `user_files3`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_review`
--
ALTER TABLE `user_review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_statuses`
--
ALTER TABLE `user_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookmarked_missions`
--
ALTER TABLE `bookmarked_missions`
  ADD CONSTRAINT `bookmarked_missions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bookmarked_missions_ibfk_2` FOREIGN KEY (`missionId`) REFERENCES `missions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bookmarked_users`
--
ALTER TABLE `bookmarked_users`
  ADD CONSTRAINT `bookmarked_users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bookmarked_users_ibfk_2` FOREIGN KEY (`userBookmarkId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `chats_private`
--
ALTER TABLE `chats_private`
  ADD CONSTRAINT `chats_private_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chats_private_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chats_private_ibfk_3` FOREIGN KEY (`lastMessageOwnerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `disputes`
--
ALTER TABLE `disputes`
  ADD CONSTRAINT `disputes_ibfk_1` FOREIGN KEY (`milestoneId`) REFERENCES `milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `evidences`
--
ALTER TABLE `evidences`
  ADD CONSTRAINT `evidences_ibfk_1` FOREIGN KEY (`milestoneId`) REFERENCES `milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `evidences_files`
--
ALTER TABLE `evidences_files`
  ADD CONSTRAINT `evidences_files_ibfk_1` FOREIGN KEY (`evidenceId`) REFERENCES `evidences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`chatPrivateId`) REFERENCES `chats_private` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `messages_group`
--
ALTER TABLE `messages_group`
  ADD CONSTRAINT `messages_group_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `milestones`
--
ALTER TABLE `milestones`
  ADD CONSTRAINT `milestones_ibfk_1` FOREIGN KEY (`statusId`) REFERENCES `milestone_statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `milestones_ibfk_2` FOREIGN KEY (`paymentStatusId`) REFERENCES `milestone_payment_statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `milestones_ibfk_3` FOREIGN KEY (`proposalsId`) REFERENCES `proposals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `missions`
--
ALTER TABLE `missions`
  ADD CONSTRAINT `missions_ibfk_1` FOREIGN KEY (`budgetId`) REFERENCES `mission_budget` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `missions_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `missions_ibfk_3` FOREIGN KEY (`missionFundingTypeId`) REFERENCES `missions_funding_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `missions_ibfk_4` FOREIGN KEY (`missionTypeId`) REFERENCES `missions_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `missions_applicants`
--
ALTER TABLE `missions_applicants`
  ADD CONSTRAINT `missions_applicants_ibfk_1` FOREIGN KEY (`missionId`) REFERENCES `missions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `missions_applicants_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `missions_categories`
--
ALTER TABLE `missions_categories`
  ADD CONSTRAINT `missions_categories_ibfk_1` FOREIGN KEY (`missionId`) REFERENCES `missions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `missions_categories_ibfk_2` FOREIGN KEY (`catId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mission_files`
--
ALTER TABLE `mission_files`
  ADD CONSTRAINT `mission_files_ibfk_1` FOREIGN KEY (`missionId`) REFERENCES `missions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `proposals`
--
ALTER TABLE `proposals`
  ADD CONSTRAINT `proposals_ibfk_1` FOREIGN KEY (`statusId`) REFERENCES `proposal_statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `proposals_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `proposals_ibfk_3` FOREIGN KEY (`missionId`) REFERENCES `missions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`milestoneId`) REFERENCES `milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`userPaidId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`userReceivedId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `user_roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `user_statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users_categories`
--
ALTER TABLE `users_categories`
  ADD CONSTRAINT `users_categories_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_categories_ibfk_2` FOREIGN KEY (`catId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_employment`
--
ALTER TABLE `user_employment`
  ADD CONSTRAINT `user_employment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_files`
--
ALTER TABLE `user_files`
  ADD CONSTRAINT `user_files_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_files2`
--
ALTER TABLE `user_files2`
  ADD CONSTRAINT `user_files2_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_files3`
--
ALTER TABLE `user_files3`
  ADD CONSTRAINT `user_files3_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_review`
--
ALTER TABLE `user_review`
  ADD CONSTRAINT `user_review_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_review_ibfk_2` FOREIGN KEY (`missionId`) REFERENCES `missions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_review_ibfk_3` FOREIGN KEY (`proposalId`) REFERENCES `proposals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_review_ibfk_4` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
