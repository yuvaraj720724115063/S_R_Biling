# S.R.CYCLE

## Project Description
i create a softer billing webapp to use a different user to login to billing  fist to login page to use and it give to inter face to use in total estimate or bill and total product and banding estimate or bill and low stock product and banding bill list and low stock list and to enter a new estimate or bill to enter to open a new page to use and its there different type to use  in 1) GST bill ,2) estimate bill , 3) shop to shop bill and enter a stock to open a new page in to add stock and delete stock and update stock in count and amount and total stock and billing or new estimate in use in HSN code in used in add product to select a item and customer name and date to use and total amount of the product to print a bill to billing meshing
the shop name is S.R. Cycle & Auto Spares
Addresses is Thennampulam - 614 806
phone number 9487170053, 7358446429
its based on a sparce shop  

## Product Requirements Document
PRODUCT REQUIREMENTS DOCUMENT (PRD) - S.R.CYCLE Billing WebApp

1. INTRODUCTION

1.1 Purpose
This document outlines the requirements, goals, features, and specifications for the development of a soft billing web application tailored for S.R. Cycle & Auto Spares. This application aims to streamline the billing, estimation, and inventory management processes for the spare parts shop.

1.2 Project Goals
*   To implement a user-friendly web interface for creating various types of bills and estimates.
*   To provide distinct user roles with appropriate access controls.
*   To accurately manage product stock, including adding, updating, and tracking low stock items.
*   To generate essential reports based on sales history and inventory levels.
*   To support necessary printing requirements for billing.

1.3 Scope
The system will cover user authentication, master data management (products, customers), estimation and billing workflows, stock management, and basic reporting.

2. BUSINESS REQUIREMENTS

2.1 Business Context
The system is being developed for S.R. Cycle & Auto Spares, a spare parts shop, to digitize and standardize its invoicing and inventory tracking processes. The system must handle specific billing formats required by the business.

2.2 Company Information (To be displayed on all documents)
Shop Name: S.R. Cycle & Auto Spares
Address: Thennampulam - 614 806
Contact Numbers: 9487170053, 7358446429

2.3 Success Metrics
*   Successful creation and printing of all defined bill types.
*   Accurate real-time tracking of stock levels post-sale/stock addition.
*   Adoption of the system by Biller and Stock Manager roles.

3. USER STORIES AND FUNCTIONAL REQUIREMENTS

3.1 Authentication and User Management
FR1.1: The system must provide a secure login page.
FR1.2: The system must support the following user roles with defined permissions:
    *   Administrator: Full access to all modules (System configuration, User management, Stock, Billing, Reporting).
    *   Stock Manager: Access restricted to Stock Entry, Stock Update, Stock Deletion, and viewing Stock Lists. Cannot access billing or reporting features outside of stock-related views.
    *   Biller: Access to Billing Interface, Estimate Generation, Customer/Product lookup, Stock Check features, and viewing daily/transactional reports. Cannot modify master stock counts directly (except via a completed bill).

3.2 Estimation and Billing Module
FR2.1: Users must be able to initiate a new transaction page that allows selection of the transaction type.
FR2.2: The system must support the following bill/estimate types:
    *   GST Bill (Standard Sales Invoice)
    *   Estimate Bill (Quotation)
    *   Shop to Shop Bill (Inter-shop transfer/sale documentation, if applicable, must have a distinct format/label).
FR2.3: For every new transaction, the user must input/select:
    *   Customer Name (Must be selectable from a master list).
    *   Date of Transaction.
FR2.4: Product selection must utilize the HSN Code as the primary lookup key for item selection.
FR2.5: The product interface must display: Product Name, HSN Code, Quantity, Unit Price, Total Amount for the item line.
FR2.6: The system must calculate and display subtotals, applicable taxes (GST component if GST Bill type is selected), and the Grand Total Amount.
FR2.7: The system must provide a function to print the finalized bill/estimate using supported printers.

3.3 Product and Stock Management
FR3.1: Product Master Data: Each product must be uniquely identified using its HSN Code, which acts as the primary key.
FR3.2: Stock Entry: A dedicated interface must allow Stock Managers (or Admins) to:
    *   Add new stock (specifying initial count and amount/cost).
    *   Update existing stock count and amount.
    *   Delete stock entries (with appropriate logging/confirmation).
FR3.3: Stock Tracking Logic: Stock levels must automatically decrease upon the finalization of a Sales Bill.
FR3.4: Stock Visibility: The Biller role must be able to quickly check current stock levels for any item.

3.4 Dashboard and Reporting
FR4.1: The main dashboard (accessible by Administrator and Biller) must immediately display key operational summaries.
FR4.2: The system must generate the following key lists/reports, filterable by Daily, Weekly, and Monthly periods:
    *   Low Stock List (Items where current stock count falls below a predefined threshold).
    *   Banding Bill List (List of completed sales transactions).
    *   Low Stock List (Inventory level report).
FR4.3: The dashboard must display Daily Revenue generated from finalized GST bills.

3.5 Master Data Management
FR5.1: Customer Master Data: Ability to create, view, and edit customer records. (Name is non-negotiable for tracking).
FR5.2: Product Master Data: Ability to create, view, and edit product records, linking them to their HSN code.

4. NON-FUNCTIONAL REQUIREMENTS

4.1 Performance
NFR1.1: Stock lookups using HSN code must return results in under 2 seconds.
NFR1.2: Bill generation and printing initiation must complete within 5 seconds.

4.2 Usability (UI/UX)
NFR2.1: The interface design must be clean, intuitive, and suitable for a spare parts shop environment (Modification of existing standard UI templates is expected).
NFR2.2: Clear separation and visual distinction between 'Estimate' and 'Final Bill' documents must be maintained.

4.3 Security
NFR3.1: All user credentials must be stored securely (hashed).
NFR3.2: Access control must strictly adhere to the defined User Roles and Permissions (Section 3.1).

4.4 Hardware and Printing Requirements
NFR4.1: The system must support standard output for A4 printers for formal documentation.
NFR4.2: The system must support specialized output/formatting for receipt printing on a TVS RP-45 Shoppe printer.

4.5 Deployment and Constraints
NFR5.1: The application is designed for specific, localized use ("septically use"). Deployment will be internal to the shop's environment.

5. DATA MIGRATION AND INITIAL SETUP

5.1 Initial Data Load
NFR6.1: Due to the nature of the setup, the initial stock data (product list, HSN codes, current counts, and cost amounts) must be entered manually into the system by the Administrator or designated staff. There is no automated data migration planned from legacy systems.

6. SPECIFICATIONS

6.1 Product Identification Key
HSN Code: Must be treated as the unique identifier for product records within the system, used for selection, tracking, and history retrieval.

6.2 Stock Tracking Basis
Stock levels and low stock alerts must be dynamically tracked based on sales history recorded in finalized billing transactions.

## Technology Stack
TECHNOLOGY STACK DOCUMENTATION: S.R.CYCLE Billing Web Application

1. OVERVIEW

This document outlines the recommended technology stack for the S.R. Cycle & Auto Spares Billing Web Application. The stack prioritizes reliability, ease of modification, efficient handling of inventory, and robust billing functionality suitable for a spare parts shop environment.

2. FRONTEND TECHNOLOGIES

| Technology | Version | Justification |
|---|---|---|
| **HTML5/CSS3** | Latest | Standard foundation for modern web structure and styling. |
| **JavaScript (ES6+)** | Latest | Essential for interactivity, form validation, and dynamic UI updates. |
| **React (or Vue.js)** | Latest Stable | Recommended for building a modular, maintainable, and reactive User Interface, especially crucial for complex forms (Estimates, New Bills) and dashboard views. Given the requirement to \"modify\" the UI easily, a component-based framework is essential. |
| **Bootstrap / Tailwind CSS** | Latest | For responsive design and rapid styling, ensuring usability on various screen sizes, although deeper customization based on UI preferences will be required. |

3. BACKEND TECHNOLOGIES (Server-Side Logic & API)

| Technology | Version | Justification |
|---|---|---|
| **Node.js (Express Framework)** | Latest LTS | Lightweight, fast, and uses JavaScript, potentially allowing for language continuity across the stack. Express provides a minimal, flexible framework ideal for building the necessary RESTful APIs for billing and stock management. |
| **Alternative: Python (Django/Flask)** | Latest LTS | Highly stable, excellent ORM capabilities if complex database interactions are anticipated later. Flask might be preferred for a lighter initial footprint. |

4. DATABASE TECHNOLOGIES

| Technology | Version | Justification |
|---|---|---|
| **PostgreSQL** | Latest Stable | Recommended for its transactional integrity, robust support for relational data (linking products, customers, bills), and excellent performance under moderate load. Critical for accurate inventory and financial tracking. |
| **Alternative: MySQL** | Latest Stable | A widely supported and reliable relational database, often easier for initial setup. |
| **Data Structure Note:** | N/A | The HSN Code will serve as the unique primary identifier (key) for product records. |

5. CORE FUNCTIONALITY REQUIREMENTS MAPPING

| Feature | Required Technology/Approach |
|---|---|
| Multiple Bill Types (GST, Estimate, Shop-to-Shop) | Backend logic to handle conditional data capture and specialized output formatting based on the bill type selection. |
| User Roles & Permissions (Admin, Stock Manager, Biller) | Robust authentication (e.g., JWT) and authorization middleware implemented on the backend to control API access based on role. |
| Stock Management (Add/Delete/Update Count/Amount) | Secure, transactional database operations tied to specific API endpoints accessible primarily by Stock Manager and Administrator. |
| Product Data Integrity (HSN as Primary Key) | Database constraints and validation logic to enforce HSN uniqueness during product creation/updates. |
| Reporting (Low Stock, Banding Bills, Daily Revenue) | Optimized database queries (SQL views or materialized views) to aggregate historical transaction data efficiently. |
| Printing Integration | Use of browser APIs (for standard A4 printing) and specific driver integration (or direct serial/USB communication if supported by the vendor SDK) for the TVS RP-45 Shoppe printer. |

6. DEVELOPMENT AND DEPLOYMENT TOOLS

| Tool/Technology | Purpose | Justification |
|---|---|---|
| **Git** | Version Control | Essential for tracking changes, collaboration (if the project expands), and rollback capabilities. |
| **VS Code** | IDE/Editor | Feature-rich, excellent support for JavaScript/Node.js development. |
| **Deployment Environment** | Local Server / VPS (e.g., DigitalOcean, AWS Lightsail) | Given the constraint \"it is a septically use\" (implying localized or controlled access), initial deployment might be on a local network server accessible only within the shop premises, or a small, secure VPS if remote access is later required. |
| **Data Seeding Scripts** | Initial Data Load | Scripts (SQL or Node.js based) to facilitate the manual entry requirement for initial stock data migration. |

7. HARDWARE INTERFACING CONSIDERATIONS

*   **A4 Printing:** Standard browser print dialog integration will be used initially.
*   **TVS RP-45 Shoppe Printer:** Interfacing with specialized receipt printers often requires using vendor-specific JavaScript libraries or a local proxy service if direct browser connection fails. Compatibility testing with the specific printer SDK/drivers during the development phase is mandatory.

8. MODIFICATION STRATEGY

The chosen technology stack (especially using React/Node.js) is inherently modular. This structure facilitates the developer requirement to \"modify\" the interface and workflows easily as business needs evolve. Backend APIs are decoupled from the UI, allowing frontend changes without major backend overhauls.

## Project Structure
PROJECT STRUCTURE DOCUMENT: S.R.CYCLE Billing WebApp

1. ROOT DIRECTORY STRUCTURE

The primary directory structure is designed to separate configuration, source code, static assets, and documentation for maintainability.

/SR_CYCLE_BILLING
├── .git/ (Version Control Metadata)
├── docs/ (Project Documentation)
├── src/ (Application Source Code)
├── static/ (Client-side Assets)
├── tests/ (Test Scripts)
├── config/ (Application Configuration Files)
└── README.md (Project Overview)

2. DETAILED DIRECTORY BREAKDOWN

2.1. /docs/

This directory holds all project documentation, including this structure file.

/docs/
├── projectStructure.txt (This document)
├── requirements.md (Functional and Non-functional Requirements)
├── architecture.md (High-level system design)
└── userManual.md (For Administrator, Stock Manager, Biller)

2.2. /config/

Stores environment-specific settings and database initializers.

/config/
├── database.json (DB connection strings, credentials placeholder)
├── permissions.json (Defines roles: Administrator, Stock Manager, Biller)
└── app_settings.json (Default tax rates, application name, print settings)

2.3. /src/ (Application Source Code)

Assuming a standard web application stack (e.g., Node.js/Express backend, React/Vue frontend, or similar MVC structure).

/src/
├── controllers/ (Handles business logic and routes)
│   ├── authController.js (Login, user management)
│   ├── billingController.js (Estimate/Bill generation, printing logic)
│   ├── productController.js (CRUD for products, HSN management)
│   ├── stockController.js (Stock updates, low stock logic)
│   └── reportController.js (Generating daily/weekly/monthly reports)
├── models/ (Database interaction layer/Schemas)
│   ├── User.js
│   ├── Product.js (Must include HSN as primary key identifier)
│   ├── Transaction.js (Stores Bill/Estimate data)
│   └── StockEntry.js
├── routes/ (API endpoint definitions)
│   ├── authRoutes.js
│   ├── billingRoutes.js
│   ├── inventoryRoutes.js
│   └── reportRoutes.js
├── services/ (Reusable business logic modules)
│   ├── stockService.js (Handles stock decrement/increment logic)
│   └── printingService.js (Handles formatting output for A4 and TVS RP-45)
└── server.js (Entry point for the backend application)

2.4. /static/ (Client-Side Assets)

Contains all front-end files accessible by the browser.

/static/
├── css/
│   └── styles.css (Main styling sheets, accommodating UI modifications)
├── js/
│   ├── app.js (Main application initialization)
│   ├── components/ (Reusable UI components, e.g., Table, Modal)
│   └── views/ (Specific views/pages logic)
│       ├── login.js
│       ├── dashboard.js
│       ├── billingInterface.js (Handles GST, Estimate, Shop-to-Shop entry)
│       └── stockManagement.js
└── assets/ (Images, Logos - S.R. Cycle & Auto Spares logo)

3. KEY FILE/DATA STRUCTURE CONSIDERATIONS

3.1. /src/models/Product.js (Critical Data Fields)

*   ProductID (Primary Key)
*   HSN_Code (Must be implemented as the product code/primary identifier)
*   ProductName
*   Description
*   CurrentStockCount
*   CurrentStockAmount (Monetary value, if tracked)
*   SupplierInfo
*   ReorderLevel (Used for Low Stock reporting)

3.2. /src/models/Transaction.js (Billing Structure)

Must support differentiating transaction types:
*   TransactionType: [GST_BILL, ESTIMATE, SHOP_TO_SHOP]
*   CustomerName
*   DateOfTransaction
*   LineItems: [ { ProductID, HSN_Code, Quantity, UnitPrice, Total } ]
*   SubTotal, TaxAmount, GrandTotal
*   IsBilled (For Estimates converted to bills)

3.3. /config/permissions.json (User Roles)

| Role | Access Scope | Notes |
| :--- | :--- | :--- |
| Administrator | Full Access (CRUD on Users, Stock, Billing, Reports, Configuration) | |
| Stock Manager | Stock Management (Add/Delete/Update Stock Count/Amount), View Stock Reports | No access to Biller/Financial reports or User Management. |
| Biller | Billing Interface (Create transactions), View Stock Levels (Read-only stock check), View basic daily reports. | Cannot modify master product data or user accounts. |

4. WORKFLOW MAPPING TO STRUCTURE

*   **Stock Entry/Modification:** Handled by Stock Manager accessing routes defined in `/src/controllers/stockController.js` and `/src/views/stockManagement.js`.
*   **New Estimate/Bill Generation:** Handled by Biller via `/src/views/billingInterface.js` utilizing `/src/controllers/billingController.js`. The system must allow selection between the three defined bill types.
*   **Reporting:** Accessed via Administrator/Biller through routes defined in `/src/routes/reportRoutes.js`, processing data from `/src/services/stockService.js` (for Low Stock List) and `/src/models/Transaction.js`. Reports required: Daily Revenue, Low Stock List, Banding Bill List (Daily, Weekly, Monthly).

5. HARDWARE SPECIFIC NOTES (Configuration)

Printer settings will be configured in `/config/app_settings.json` to select the output format required for the A4 printer versus the specific thermal output required for the TVS RP-45 Shoppe printer, managed within `/src/services/printingService.js`.

## Database Schema Design
SCHEMA DESIGN DOCUMENTATION FOR S.R. CYCLE & AUTO SPARES BILLING APPLICATION

DOCUMENT VERSION: 1.0
DATE: 2023-10-27

1. INTRODUCTION AND SCOPE

This document outlines the proposed database schema design for the "S.R. CYCLE" billing web application. This design focuses on managing user roles, product inventory (including stock levels and HSN codes), customer data, and transaction records (Estimates and Bills of various types).

2. ENTITY RELATIONSHIP DIAGRAM (Conceptual Overview)

The core entities include: Users, Roles, Products (with Stock), Customers, Bills/Estimates (Header), Bill/Estimate Items (Details), and potentially a configuration table for shop details.

3. DETAILED TABLE STRUCTURES

3.1. TBL_USERS

Stores application user credentials and links them to defined roles.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| UserID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the user. |
| Username | VARCHAR(50) | UNIQUE, NOT NULL | Login username. |
| PasswordHash | VARCHAR(255) | NOT NULL | Hashed password. |
| FullName | VARCHAR(100) | NOT NULL | User's full name. |
| RoleID | INT | FOREIGN KEY (TBL_ROLES) | User's assigned role. |
| IsActive | BOOLEAN | DEFAULT TRUE | Account status. |

3.2. TBL_ROLES

Defines the user roles and their permissions (simplified based on requirements).

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| RoleID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the role. |
| RoleName | VARCHAR(50) | UNIQUE, NOT NULL | e.g., Administrator, Stock Manager, Biller. |
| CanManageUsers | BOOLEAN | DEFAULT FALSE | Access to user management. |
| CanManageStock | BOOLEAN | DEFAULT FALSE | Access to add/update/delete stock. |
| CanCreateBilling | BOOLEAN | DEFAULT FALSE | Access to generate bills/estimates. |
| CanViewReports | BOOLEAN | DEFAULT FALSE | Access to reporting dashboard. |

3.3. TBL_SHOP_CONFIG

Stores persistent shop information.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| ConfigID | INT | PRIMARY KEY, AUTO_INCREMENT | |
| ShopName | VARCHAR(100) | NOT NULL | S.R. Cycle & Auto Spares |
| Address | VARCHAR(255) | NOT NULL | Thennampulam - 614 806 |
| Phone1 | VARCHAR(15) | NOT NULL | 9487170053 |
| Phone2 | VARCHAR(15) | | 7358446429 |

3.4. TBL_CUSTOMERS

Master data for customers.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| CustomerID | INT | PRIMARY KEY, AUTO_INCREMENT | Unique customer ID. |
| CustomerName | VARCHAR(150) | NOT NULL | Customer name (Non-negotiable). |
| Address | VARCHAR(255) | | Customer address. |
| Phone | VARCHAR(15) | | Customer phone number. |

3.5. TBL_PRODUCTS

Master data for inventory items. HSN Code is the primary identifier as requested.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| HSN_Code | VARCHAR(20) | PRIMARY KEY | HSN code used as the product identifier/key. |
| ProductName | VARCHAR(255) | NOT NULL | Name of the product/spare part. |
| UnitOfMeasure | VARCHAR(10) | NOT NULL | e.g., NOS, PCS. |
| PurchasePrice | DECIMAL(10, 2) | | Last known purchase price (for internal tracking). |
| SellingPrice | DECIMAL(10, 2) | NOT NULL | Standard selling price. |
| Brand | VARCHAR(100) | | Product branding information. |

3.6. TBL_STOCK

Tracks current inventory levels and values (linked to TBL_PRODUCTS). Tracks stock by count and amount/value.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| StockID | INT | PRIMARY KEY, AUTO_INCREMENT | |
| HSN_Code | VARCHAR(20) | FOREIGN KEY (TBL_PRODUCTS), UNIQUE | Links to the product. |
| CurrentStockCount | INT | NOT NULL | Current physical quantity available. |
| TotalStockValue | DECIMAL(12, 2) | NOT NULL | Total monetary value of current stock (Count * Average Cost). |
| LastUpdatedBy | INT | FOREIGN KEY (TBL_USERS) | User who last modified the stock. |
| LastUpdateDate | DATETIME | NOT NULL | Timestamp of the last stock adjustment. |
| LowStockThreshold | INT | DEFAULT 10 | Threshold for "Low Stock List" reporting. |

3.7. TBL_TRANSACTIONS_HEADER

Stores metadata for each bill or estimate created.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| TransactionID | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique ID for the transaction. |
| TransactionType | ENUM | NOT NULL | Values: 'GST_BILL', 'ESTIMATE', 'SHOP_TO_SHOP_BILL'. |
| TransactionDate | DATETIME | NOT NULL | Date and time of transaction creation/generation. |
| CustomerID | INT | FOREIGN KEY (TBL_CUSTOMERS) | The customer associated with the transaction. |
| TotalAmountBeforeTax | DECIMAL(12, 2) | NOT NULL | Sum of item totals before tax application. |
| TaxAmount | DECIMAL(10, 2) | | Calculated tax amount. |
| GrandTotal | DECIMAL(12, 2) | NOT NULL | Final amount payable/estimated. |
| Status | ENUM | NOT NULL | e.g., DRAFT, COMPLETED, CANCELLED. (Estimates vs Bills) |
| CreatedByUserID | INT | FOREIGN KEY (TBL_USERS) | User who created the transaction. |

3.8. TBL_TRANSACTIONS_ITEMS

Stores the detailed line items for each transaction header.

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| LineItemID | BIGINT | PRIMARY KEY, AUTO_INCREMENT | |
| TransactionID | BIGINT | FOREIGN KEY (TBL_TRANSACTIONS_HEADER) | Links to the parent transaction. |
| HSN_Code | VARCHAR(20) | FOREIGN KEY (TBL_PRODUCTS) | Product sold/estimated. |
| Description | VARCHAR(255) | | Description used on the printout (if different from product name). |
| Quantity | DECIMAL(10, 3) | NOT NULL | Quantity sold/estimated. |
| UnitPrice | DECIMAL(10, 2) | NOT NULL | Price used at the time of transaction. |
| ItemTotal | DECIMAL(12, 2) | NOT NULL | Quantity * UnitPrice. |
| TaxRateUsed | DECIMAL(5, 2) | | Tax rate applied for this line item (%). |

4. RELATIONSHIPS AND WORKFLOW IMPLICATIONS

4.1. Stock Deduction Logic (Crucial for Biller Role)

When a transaction moves from ESTIMATE to COMPLETED (or directly created as a bill), the following must occur:
1.  A corresponding entry in TBL_TRANSACTIONS_HEADER/ITEMS is created/updated.
2.  The `CurrentStockCount` and `TotalStockValue` in TBL_STOCK for the associated HSN_Code must be decremented based on the `Quantity` sold in TBL_TRANSACTIONS_ITEMS. This logic is primarily executed by the Biller workflow, utilizing the stock check feature.

4.2. Reporting Data Aggregation

*   **Low Stock List:** Data pulled from TBL_STOCK where `CurrentStockCount` <= `LowStockThreshold`. Can be filtered by Brand (if Brand is added to TBL_STOCK or derived from TBL_PRODUCTS).
*   **Banding Bill List (Sales History):** Aggregated data from TBL_TRANSACTIONS_HEADER and TBL_TRANSACTIONS_ITEMS, grouped by date/week/month, filtering specifically on `TransactionType` = 'GST_BILL' or similar finalized types.
*   **Daily Revenue:** Sum of `GrandTotal` from TBL_TRANSACTIONS_HEADER where `TransactionDate` matches the reporting period and `Status` is 'COMPLETED'.

4.3. HSN Code Implementation

The HSN_Code field is enforced as the PRIMARY KEY in TBL_PRODUCTS, making it the central linking attribute across the system for products, stock, and transaction details.

4.4. Data Migration

Initial data load for TBL_PRODUCTS and TBL_STOCK must be performed manually by the Administrator or Stock Manager via the designated stock entry interface, ensuring the `CurrentStockCount` and initial pricing are accurate.

5. HARDWARE AND PRINTING CONSIDERATIONS

*   **A4 Printer:** General reports and potentially complex, formal GST bills might utilize this. Standardized PDF generation based on TBL_TRANSACTIONS_HEADER/ITEMS.
*   **TVS RP-45 Shoppe Printer:** Requires specific layout formatting for compact thermal receipt printing. The system must have dedicated output templates catering to this printer's capabilities when processing bill generation.

## User Flow
USERFLOW DOCUMENTATION: S.R.CYCLE Billing WebApp

PROJECT: S.R.CYCLE Billing & Inventory Management System
DOCUMENT: User Flow (User Journey & Interaction Patterns)
VERSION: 1.0
DATE: October 2023

SHOP DETAILS:
Shop Name: S.R. Cycle & Auto Spares
Address: Thennampulam - 614 806
Contact: 9487170053, 7358446429

================================================================
1. OVERARCHING SYSTEM ACCESS AND ROLES
================================================================

1.1. User Authentication (Login Flow)
    A. Start: System Access Point (URL)
    B. Action: User navigates to the Login Page.
    C. Interface: Fields for Username and Password.
    D. Validation: Check credentials against the user database.
    E. Success: Redirect based on User Role.
    F. Failure: Error message ("Invalid credentials").
    G. Roles & Permissions:
        1. Administrator (Admin): Full access (Billing, Stock Management, Master Data, Reporting).
        2. Stock Manager (SM): Access restricted to Stock Entry, Update, Delete functions. Cannot access billing or final reports.
        3. Biller (B): Access to Billing interface, Stock View (read-only for stock check), and viewing relevant historical bills/estimates. Cannot modify stock levels or master data.

================================================================
2. CORE FUNCTIONALITY: BILLING/ESTIMATE CREATION (Biller & Admin Path)
================================================================

2.1. Accessing New Transaction Screen
    A. Trigger: User clicks "New Estimate/Bill" button from the main dashboard (post-login).
    B. System Check: Prompt for Transaction Type Selection (Mandatory first step).

2.2. Transaction Type Selection (Wireframe Component: Modal/Dropdown)
    A. Options Presented:
        1. GST Bill (Sales Tax Invoice)
        2. Estimate Bill (Quotation)
        3. Shop-to-Shop Bill (Inter-branch/Wholesale transfer document, treated as a distinct invoice type)
    B. Selection: User chooses one type. This dictates subsequent tax calculation and printing format.

2.3. Transaction Header Data Entry
    A. Fields:
        1. Customer Name (Selection from Master Data or manual entry/temporary entry if allowed by Admin setting).
        2. Date of Transaction (Defaults to current date, editable).
        3. Bill/Estimate Number (System auto-generates based on sequence, editable by Admin).
        4. Transaction Type Confirmation (Read-only display of selection from 2.2).

2.4. Product Line Item Entry (The core iteration loop)
    A. Action: User clicks "Add Product Line".
    B. Field: HSN Code / Product Code Input (Primary Key Lookup).
    C. Lookup Action: System searches product master database using the entered HSN Code.
    D. Result Display: Upon successful HSN lookup, display the following fields pre-populated:
        1. Product Name (Non-negotiable: Must match master data).
        2. Unit Price (Base Price from Master).
        3. Available Stock (Read-only display of current inventory count).
        4. Quantity Sold/Estimated (User input field).
    E. Calculation Triggered: As Quantity is entered, calculate: Line Total = Quantity * Unit Price.
    F. Stock Validation (Biller/Admin): If Quantity Sold > Available Stock, system issues a warning/alert (Stock check feature). Stock Manager is likely exempt from this warning if performing direct stock movements.
    G. Repetition: User repeats 2.4.A through 2.4.F until all items are added.

2.5. Finalizing Transaction & Printing
    A. Interface: Review pane displaying all line items, Subtotal, Applicable Tax (based on Bill Type 1), and Grand Total Amount.
    B. Discount Field (Optional, Admin/Biller level): Field to input percentage or fixed amount discount.
    C. Action: User clicks "Generate Bill/Estimate".
    D. Output Generation: System locks the transaction record.
    E. Printing Configuration:
        1. Selection Prompt: Choose Printer Output (A4 Printer OR TVS RP-45 Shoppe Printer).
        2. Data Sent to Printer: Includes Shop Name, Address, Contact details, Bill Type, Customer Details, Line Items (Product Name, HSN Code, Qty, Price, Total), Grand Total, and Date/Time Stamp.

================================================================
3. STOCK MANAGEMENT (Stock Manager & Admin Path)
================================================================

3.1. Accessing Stock Management Interface
    A. Trigger: User clicks "Manage Stock" link (Visible only to Admin/SM).

3.2. Stock View/Search (Default view, Manual Data Entry Requirement)
    A. Initial State: Displays current inventory snapshot (Product Name, HSN Code, Count, Amount/Value, Total Stock Value).
    B. Search/Filter: Ability to filter by HSN Code, Name, or view items below minimum threshold.

3.3. Adding New Stock (Manual Entry based on requirement)
    A. Action: Click "Add Stock Entry".
    B. Fields Required:
        1. HSN Code (System checks if product exists in master; if not, prompts for master addition/creation - Admin only).
        2. Date of Stock Addition.
        3. Quantity Added (Increment to current stock).
        4. Purchase Cost/Unit Amount (Used for inventory valuation, distinct from Selling Price).
    C. Calculation: System updates: New Stock Count = Old Count + Quantity Added; Total Stock Value is updated.

3.4. Updating Existing Stock (Count and Amount Adjustment)
    A. Action: Select existing item row and click "Update".
    B. Fields Editable: Quantity (Manual count adjustment/correction), Unit Amount (Cost update).
    C. Stock Tracking Logic: Updates must be logged, noting which role made the adjustment and the reason (if required by Admin settings).

3.5. Deleting Stock/Product Entry
    A. Restriction: Product deletion is likely restricted to Admin. Stock Manager can only set quantity to zero or archive.
    B. Flow: Select item -> Confirm Deletion -> System prompts for reason -> Archive record or physically delete (Admin decision).

================================================================
4. REPORTING AND DASHBOARD (Admin & Biller Access)
================================================================

4.1. Dashboard Overview (Initial view post-login for Admin/Biller)
    A. Key Metrics Display: Daily Revenue Summary.

4.2. Low Stock List Generation
    A. Trigger: User clicks "Low Stock Report".
    B. Logic: Compares current stock count against predefined minimum threshold (set during product master creation or via configuration).
    C. Filtering/Grouping: Viewable by Day, Week, or Month summary of items that hit the low threshold.

4.3. Banding Bill List (Historical Billing Review)
    A. Trigger: User clicks "Banding Bill List Report".
    B. Filtering Parameters: Date Range selection (Daily, Weekly, Monthly defaults available).
    C. Output: List of finalized GST Bills, Estimate Bills, and Shop-to-Shop Bills matching the date criteria, including total sales amount for that period.

4.4. Sales History Tracking (Sales History to Track Product Movement)
    A. View: Detailed transaction log searchable by Date, Customer, or Bill Type.
    B. Interaction: Clicking a specific bill entry in this list opens a read-only view of that finalized invoice (similar to 2.5.E).

## Styling Guidelines
S.R.CYCLE Styling Guidelines Document

1. Introduction
This document outlines the styling and design principles for the S.R.CYCLE Billing Web Application. The goal is to create a clean, professional, and efficient interface suitable for billing, inventory management, and reporting within a sparse shop environment. The aesthetic aims for clarity and ease of use, acknowledging the operational needs of the business (S.R. Cycle & Auto Spares).

2. Color Palette

The palette is designed to be professional, accessible, and functional, minimizing visual clutter while clearly highlighting important data (like low stock alerts or successful actions).

Primary Color (Brand Accent): Deep Blue
Hex: #003366 (Represents reliability and professionalism)
Usage: Primary buttons, navigation headers, key active states.

Secondary Color (Action/Success): Bright Green
Hex: #28A745
Usage: Save/Submit buttons, successful confirmation messages, indicating available stock.

Warning/Alert Color (Low Stock): Amber/Orange
Hex: #FFC107
Usage: Low Stock indicators, warnings, cautionary alerts in lists.

Error Color: Red
Hex: #DC3545
Usage: Delete actions, validation errors, critical alerts.

Neutral Palette (Backgrounds and Text):
Background (Main): Off-White/Light Grey
Hex: #F8F9FA (Provides a soft contrast)
Text Primary: Near Black
Hex: #212529 (Ensures high readability)
Borders/Separators: Light Grey
Hex: #DEE2E6

3. Typography

Clarity and readability are paramount, especially for numerical data and product codes (HSN).

Primary Font Family: Sans-serif (e.g., Arial, Helvetica, or a standard system font stack)
Rationale: Standard web fonts offer excellent readability across different screen sizes and are fast loading.

Font Scale Guidelines:

| Element | Font Size (Approx.) | Weight | Usage Context |
| :--- | :--- | :--- | :--- |
| Headings (H1 - Page Titles) | 28px - 32px | Bold (700) | Main screen titles (e.g., New Bill, Stock Management) |
| Headings (H2 - Section Titles) | 20px - 24px | Semi-Bold (600) | Major sections within a page |
| Body Text (General) | 14px - 16px | Regular (400) | Descriptions, labels, standard list items |
| Input Fields/Data Display | 14px | Regular/Medium (500) | Transaction amounts, quantities, critical numbers |
| Labels/Tooltips | 12px - 13px | Regular (400) | Subtle labels, helper text |

4. Layout and Spacing (UI/UX Principles)

4.1. Grid System and Responsiveness
The layout should utilize a flexible grid system, prioritizing desktop/tablet use, given the nature of detailed data entry (billing, stock management). While mobile viewing might occur, primary operations are expected on larger screens.

4.2. Spacing (Padding and Margins)
Use a standardized 8px increment system for consistent spacing.
*   Internal Component Padding: 12px - 16px (for clear separation of elements inside cards/forms).
*   Section Margins: 24px - 32px (to separate major functional blocks).

4.3. Navigation
Primary navigation should be persistent and clear, allowing quick switching between core functions: Dashboard, Billing/Estimates, Stock Management, Reporting, Customer/Product Master.

5. Interface Elements Styling

5.1. Buttons
Buttons must clearly convey their action and state.

*   Primary Action (e.g., Generate Bill, Save Stock): Use Primary Color (#003366) background, white text.
*   Secondary Action (e.g., Cancel, Back): Light border with white background, dark text.
*   Delete/Destructive Action: Use Error Color (#DC3545) background, white text, often requiring a confirmation modal.
*   Disabled State: Light grey background with dimmed text (opacity reduction).

5.2. Forms and Inputs
Inputs must be highly legible, especially for numerical entry (quantity, rate, HSN code).
*   Borders: 1px solid Light Grey (#DEE2E6).
*   Focus State: Border color shifts to Primary Blue (#003366).
*   Data Entry Focus: Inputs for amounts and HSN codes should align text to the right where appropriate for numerical clarity.

5.3. Data Tables (Lists: Bills, Stock, Customers)
Tables are critical for reviewing lists (Banding Bill List, Low Stock List).
*   Alternating Row Colors (Zebra Striping): Use very light grey (#FAFAFA) for every second row to aid horizontal scanning.
*   Header Row: Darker background (e.g., very light shade of Primary Blue or dark grey) with bold, white text.
*   Critical Data Highlighting: Low stock items in the Low Stock List must use the Warning Color (#FFC107) on the corresponding row background or text, as per Administrator preference.

5.4. Dashboard Visualization
The Dashboard must immediately present key operational metrics: Daily Revenue, Low Stock Summary. Visualizations should use the defined color palette, ensuring high contrast.

6. Specific Workflow Styling Notes

6.1. Estimate vs. Bill Distinction
When viewing or creating an Estimate Bill versus a standard GST Bill, clear visual indicators (e.g., a prominent colored banner or large tag label) must distinguish the document type immediately.

6.2. Stock Management Interface
The Stock Add/Update/Delete interface must clearly delineate:
*   Current Stock Count.
*   Quantity being added/removed.
*   The resulting Total Stock.
The interface should guide the Stock Manager clearly through the count adjustment process.

6.3. Product Entry (HSN Code)
Since the HSN code acts as the primary key, its input field should be clearly labeled and highly visible during product creation, potentially styled to resemble a unique identifier (e.g., slightly bolder border when focused).

7. Print Output Styling (A4 and TVS RP-45 Shoppe Printer)

Bill printing requires minimal, professional formatting optimized for ink efficiency (favoring black text where possible).

7.1. Mandatory Elements for all Prints (GST, Estimate, Shop-to-Shop):
*   Shop Name (Prominent): S.R. Cycle & Auto Spares
*   Address and Contact Numbers: Thennampulam - 614 806, 9487170053, 7358446429
*   Document Type Header (e.g., "TAX INVOICE" or "ESTIMATE")
*   Date and Serial/Bill Number
*   Product Details Table (Item Name, HSN Code, Quantity, Rate, Total Amount)
*   Grand Total (Bolded)

7.2. Printer Specific Considerations
*   TVS RP-45 Shoppe Printer: Output may require simplified, condensed text formatting suitable for thermal/dot matrix printing if that printer is used for receipts. Prioritize clarity over complex styling for this output channel.
*   A4 Printer: Standard professional layout matching the web interface clarity.

8. Accessibility and User Roles
The design must support the primary user roles:
*   Administrator: Interface should be fully functional and organized for comprehensive management.
*   Stock Manager: Stock management screens must be simplified, emphasizing quantity inputs and confirmation, reducing visibility of billing/reporting features if possible.
*   Biller: Billing screens must be optimized for speed, with clear paths for product selection (via HSN or name) and final bill generation.

The design preference is stated as modification required; this styling guide serves as the baseline for achieving that modification toward a cleaner, more focused operational tool.
