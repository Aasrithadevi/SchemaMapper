// src/data/fields.js
export const sourceFields = [
    { id: "source-1", name: "source_system", type: "text" },
    { id: "source-2", name: "Brand", type: "varchar" },
    { id: "source-3", name: "source_system_id", type: "integer" },
    { id: "source-4", name: "deluxe_pickup_date", type: "text" },
    { id: "source-5", name: "customer_prospect_ind", type: "varchar" },
    { id: "source-6", name: "business_name", type: "text" },
    { id: "source-7", name: "phone", type: "text" },
    { id: "source-8", name: "cell", type: "text" },
    { id: "source-9", name: "business_type", type: "text" },
    { id: "source-10", name: "lob_cd", type: "text" },
  ];
  
  export const targetFields = [
    { id: "target-1", name: "cust_id", type: "text" },
    { id: "target-2", name: "entity_type", type: "varchar(100)" },
    { id: "target-3", name: "business_name_dba", type: "integer" },
    { id: "target-4", name: "business_name_legal_name", type: "varchar(100)" },
    { id: "target-5", name: "business_name_alternative", type: "array" },
    { id: "target-6", name: "business_phone_primary", type: "varchar(100)" },
    { id: "target-7", name: "business_phone_secondary", type: "varchar(100)" },
    { id: "target-8", name: "business_phone_mobile", type: "text" },
    { id: "target-9", name: "source_system", type: "text" },
    { id: "target-10", name: "business_phone_mobile", type: "text" },
  ];
  