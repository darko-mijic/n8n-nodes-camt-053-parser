# n8n-nodes-camt-053-parser

A community node for [n8n](https://n8n.io/) that parses ISO 20022 CAMT.053 bank statement XML files into structured JSON. This node leverages the robust [camt-parser](https://github.com/your-org/iso-20022-camt-053-parser) engine and is designed for use in n8n workflows.

> **What are n8n Community Nodes?**
>
> [n8n](https://n8n.io/) is a powerful, open-source workflow automation tool. Community nodes extend n8n to integrate with new services or add new functionality. Learn more in the [n8n Community Nodes documentation](https://docs.n8n.io/integrations/community-nodes/).

---

## Features

- Parses ISO 20022 CAMT.053.001.02, .001.08, and .001.13 XML files
- Validates XML against XSD schemas
- Handles bank-specific quirks and missing/non-standard fields
- Outputs each parsed statement as a **separate n8n item** (see Output section)
- No credentials required; works entirely on provided XML

## How It Works

1. Add the node to your n8n workflow.
2. Paste your CAMT.053 XML string into the node's input parameter.
3. Each statement parsed from the XML will be output as a separate item, ready for further processing in your workflow.

## Input

- **XML String**: The raw CAMT.053 XML content to parse (as a string).

## Output

- Each **statement** in the XML is output as a separate n8n item (object).
- This is different from the original camt-parser library, which returns all statements as an array. Here, n8n's itemized output allows you to process each statement individually in subsequent nodes.

### Example Output Item
```json
{
  "statementTitle": "Statement 001",
  "accountHolder": "John Doe",
  "accountIBAN": "DE1234567890",
  "currency": "EUR",
  "statementDate": "2024-01-31",
  "openingBalance": 1000.00,
  "closingBalance": 1200.00,
  "numberOfCredits": 3,
  "totalCredits": 500.00,
  "numberOfDebits": 2,
  "totalDebits": 300.00,
  "transactions": [
    {
      "date": "2024-01-30",
      "amount": 200.00,
      "currency": "EUR",
      "type": "credit",
      "counterpartyName": "Acme Corp",
      "counterpartyAccountIBAN": "DE0987654321",
      "description": "Invoice 1234",
      "descriptionAdditional": null,
      "endToEndReference": "E2E-REF-001",
      "remittanceReference": "RF18539007547034",
      "purpose": "SALA"
    }
  ]
}
```
- Fields may be `null` if not present in the source XML.
- See [camt-parser documentation](#parser-features--details) for full output structure details.

## Supported Standards

- ISO 20022 CAMT.053.001.02
- ISO 20022 CAMT.053.001.08
- ISO 20022 CAMT.053.001.13

## Limitations & Notes

- **Field nullability**: If a field is missing in the source XML, it will be `null` in the output.
- **XSD validation**: Files that do not conform to the XSD will fail to parse.
- **Bank-specific quirks**: Some banks may use highly non-standard layouts. Further customization may be required for edge cases.

## Example Usage

1. Add the "Camt053 Parser" node to your n8n workflow.
2. Paste your CAMT.053 XML string in the node's "XML String" parameter.
3. Each statement will be output as a separate item for downstream processing.

## Parser Features & Details

This node is powered by the [camt-parser](https://github.com/your-org/iso-20022-camt-053-parser) engine. For detailed field descriptions, supported versions, and extension instructions, see the [camt-parser README](https://github.com/your-org/iso-20022-camt-053-parser#readme).

## License

MIT. See [LICENSE](LICENSE) for details.
