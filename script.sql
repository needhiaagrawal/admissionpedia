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
