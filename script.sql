CREATE TABLE IF NOT EXISTS `ap_school_facilities_relation` 
(`id` INTEGER NOT NULL auto_increment ,
 `school_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
 `facility_id` SMALLINT(11) NOT NULL, 
 `value` VARCHAR(255), 
 PRIMARY KEY (`id`),
 FOREIGN KEY (`school_id`) REFERENCES `ap_schools` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
 FOREIGN KEY (`facility_id`) REFERENCES `ap_facilities` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `ap_school_class_relation` 
(`id` INTEGER NOT NULL auto_increment ,
 `school_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
 `class_id` SMALLINT(11) NOT NULL, 
 PRIMARY KEY (`id`),
 FOREIGN KEY (`school_id`) REFERENCES `ap_schools` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
 FOREIGN KEY (`class_id`) REFERENCES `ap_classes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `ap_schools_classes_admission` 
(`id` INTEGER NOT NULL auto_increment ,
 `school_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
 `class_id` SMALLINT(11) NOT NULL, 
  `start_date` datetime NOT NULL,
 `end_date` datetime NOT NULL,
 `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1 == active, 2 == not active',
 `fee` int(11) NOT NULL DEFAULT '0',
 `created` datetime NOT NULL,
 `updated` datetime NOT NULL DEFAULT NOW() ON UPDATE now(),
 PRIMARY KEY (`id`),
 FOREIGN KEY (`school_id`) REFERENCES `ap_schools` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
 FOREIGN KEY (`class_id`) REFERENCES `ap_classes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB;



DELIMITER $$
CREATE TRIGGER update_ap_school_status_on_insert
	AFTER INSERT
    ON `ap_schools_classes_admission` FOR EACH ROW

BEGIN
    UPDATE `ap_schools` SET status = (
    SELECT IF(innerT2.total = 0, 0, 1) FROM (
    	SELECT COUNT(*) AS total FROM `ap_schools_classes_admission` WHERE `ap_schools_classes_admission`.`school_id` = NEW.`school_id` AND `ap_schools_classes_admission`.start_date <= CURRENT_DATE() AND `ap_schools_classes_admission`.end_date >= CURRENT_DATE() AND `ap_schools_classes_admission`.status = 1
    ) AS innerT2
)
	WHERE `ap_schools`.`id` = NEW.`school_id`;
END$$    

DELIMITER ;

  CREATE TRIGGER update_ap_school_status_on_update
	AFTER UPDATE
    ON `ap_schools_classes_admission` FOR EACH ROW
    UPDATE `ap_schools` SET status = (
    SELECT IF(innerT2.total = 0, 0, 1) FROM (
    	SELECT COUNT(*) AS total FROM `ap_schools_classes_admission` WHERE `ap_schools_classes_admission`.`school_id` = NEW.`school_id` AND `ap_schools_classes_admission`.start_date <= CURRENT_DATE() AND `ap_schools_classes_admission`.end_date >= CURRENT_DATE() AND `ap_schools_classes_admission`.status = 1
    ) AS innerT2
)
	WHERE `ap_schools`.`id` = NEW.`school_id`;

ALTER TABLE `ap_schools`
ADD admission_status integer;




-- 1 Dec 
CREATE TABLE IF NOT EXISTS `ap_users` (
`id` INTEGER NOT NULL auto_increment ,
 `name` VARCHAR(255) NOT NULL,
 `password` VARCHAR(255) NOT NULL,
 `email` VARCHAR(255) NOT NULL,
 `auth_key` VARCHAR(255),
 `accessToken` VARCHAR(255),
 `mobile` VARCHAR(20) NOT NULL,
 `mobile_verification_code` VARCHAR(10),
 `password_reset_code` VARCHAR(40),
 `mobile_verified` TINYINT(4),
 `email_verified` TINYINT(4), 
 `referring_school_id` VARCHAR(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
 `created` DATETIME NOT NULL, 
 `modified` DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
PRIMARY KEY (`id`),
 FOREIGN KEY (`referring_school_id`) REFERENCES `ap_schools` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;

ALTER TABLE `ap_users`
ADD UNIQUE (email);

ALTER TABLE `ap_users`
ADD UNIQUE (mobile);


                                                                          
ALTER TABLE `ap_users`
ADD mobile_expiry_time datetime;

ALTER TABLE `ap_users`
ADD email_expiry_time datetime;

ALTER TABLE `ap_users`
ADD email_verification_code varchar(10) unique;
-- 10 jan 23
ALTER TABLE `ap_shortlisted_schools` 
change school_id school_id varchar(15);

--12 jan 23
CREATE TABLE `ap_fields_fixed` (
  `id` int(11) NOT NULL auto_increment,
  `field_name` varchar(100) NOT NULL,
  `field_code` varchar(10) NOT NULL,
  `field_type` varchar(100) NOT NULL COMMENT 'string, number, set, date, file, link',
  `field_hint` text NOT NULL,
  `special_type` varchar(100) NOT NULL COMMENT 'student_name, father_name, contact_email_contact_number, address, dob, class',
  `field_constraints` text NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table `fields_fixed`
INSERT INTO `ap_fields_fixed` (`id`, `field_name`, `field_code`, `field_type`, `field_hint`, `special_type`, `field_constraints`, `position`) VALUES
(1, 'Student Name', 'sname', 'string', '', 'student_name', 'a:4:{s:10:\"min_length\";s:1:\"1\";s:10:\"max_length\";s:2:\"70\";s:9:\"multiline\";i:0;s:14:\"field_required\";i:1;}', 1),
(2, 'Father Name', 'fname', 'string', '', 'father_name', 'a:4:{s:10:\"min_length\";s:1:\"5\";s:10:\"max_length\";s:2:\"70\";s:9:\"multiline\";i:0;s:14:\"field_required\";i:1;}', 2),
(3, 'Mother Name', 'Mname', 'string', '', '', 'a:4:{s:10:\"min_length\";s:1:\"5\";s:10:\"max_length\";s:2:\"70\";s:9:\"multiline\";i:0;s:14:\"field_required\";i:1;}', 3),
(4, 'Contact Email', 'Email', 'email', '', 'contact_email', 'a:1:{s:14:\"field_required\";i:1;}', 4),
(5, 'Contact Mobile Number', 'mobile', 'number', '', 'contact_number', 'a:6:{s:9:\"min_value\";s:0:\"\";s:9:\"max_value\";s:0:\"\";s:10:\"min_length\";s:2:\"10\";s:10:\"max_length\";s:2:\"10\";s:10:\"is_integer\";i:1;s:14:\"field_required\";i:1;}', 5),
(6, 'Residance Address', 'R_address', 'string', '', 'address', 'a:4:{s:10:\"min_length\";s:1:\"5\";s:10:\"max_length\";s:3:\"250\";s:9:\"multiline\";i:1;s:14:\"field_required\";i:1;}', 6),
(7, 'Annual Income', 'Income', 'number', '', '', 'a:6:{s:9:\"min_value\";s:0:\"\";s:9:\"max_value\";s:0:\"\";s:10:\"min_length\";s:1:\"1\";s:10:\"max_length\";s:2:\"10\";s:10:\"is_integer\";i:1;s:14:\"field_required\";i:1;}', 7),
(9, 'Religion', 'religion', 'set', '', '', 'a:2:{s:3:\"set\";s:54:\"Hindu\r\nMuslim\r\nChristian\r\nJain\r\nBuddhism\r\nJews\r\nOthers\";s:14:\"field_required\";i:1;}', 9),
(10, 'Class', 'class', 'set', '', 'class', 'a:2:{s:3:\"set\";s:0:\"\";s:14:\"field_required\";i:1;}', 10),
(13, 'Date of Birth', 'DoB', 'date', '', 'dob', 'a:3:{s:9:\"min_value\";s:10:\"17-12-2017\";s:9:\"max_value\";s:10:\"01-01-1997\";s:14:\"field_required\";i:1;}', 11),
(14, 'Aadhaar Number', 'Aadhaar', 'number', '', '', 'a:6:{s:9:\"min_value\";s:0:\"\";s:9:\"max_value\";s:0:\"\";s:10:\"min_length\";s:0:\"\";s:10:\"max_length\";s:2:\"13\";s:10:\"is_integer\";i:0;s:14:\"field_required\";i:1;}', 12);
--
CREATE TABLE `ap_forms_submissions` (
  `id` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ,
  `school_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `class_id` SMALLINT(11) NOT NULL, 
  `user_id` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL COMMENT '0 == not approved, 1 == approved, 2 == declined, 3 == deleted',
  `payment_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 == not paid, 1 == paid',
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`school_id`) REFERENCES `ap_schools` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `ap_classes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `ap_users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
CREATE TABLE `ap_forms_submissions_values` (
  `id` int(11) NOT NULL auto_increment ,
  `submission_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `field_value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `forms_submissions_values`
  ADD UNIQUE KEY `ap_fsv_all` (`submission_id`,`field_id`,`field_value`(576));