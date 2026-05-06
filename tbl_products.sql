-- Updated Sample SQL Dump for testing transformations
INSERT INTO `tbl_products` (`product_title`, `product_slug`, `price`, `description`, `category_id`, `subcategory_id`, `gallery`, `gender`, `product_type`, `feature`, `topselling`) VALUES
('Elegant Gold Ring', 'elegant-gold-ring', 240.00, 'A beautiful 18K gold ring.', 1, 10, 'image1.jpg,image2.jpg', '2', 'Ring', 1, 1),
('Diamond Necklace', 'diamond-necklace', 850.50, 'Exquisite diamond necklace.', 2, 20, '["necklace1.jpg", "necklace2.jpg"]', '2', 'Necklace', 0, 0),
('Men\'s Silver Bracelet', 'mens-silver-bracelet', 120.00, 'Solid silver bracelet.', 3, 30, 'bracelet.jpg', '1', 'Bracelet', 0, 1),
('Unisex Watch', 'unisex-watch', 500.00, 'Classic timepiece.', 4, 40, '', 'Unisex', 'Watch', 1, 0);
