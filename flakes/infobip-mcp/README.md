# Infobip Omnichannel Communication Platform

Official Infobip MCP server for enterprise-grade multi-channel messaging.

## Features

- **6 Communication Channels**: SMS, RCS, WhatsApp, Viber, Voice, Email
- **Global Coverage**: 190+ countries, 700+ direct carrier connections
- **Enterprise Scale**: Production-ready, SOC 2 Type II certified
- **Two-Factor Auth**: Built-in 2FA/PIN verification
- **Contact Management**: CRM-style contact database
- **Delivery Reports**: Real-time delivery status tracking
- **Template Support**: Pre-approved message templates
- **Bulk Messaging**: Send to millions simultaneously

## Architecture

**Hosted Remote Server**: No local installation required. Connects to Infobip's cloud infrastructure via MCP protocol.

**Transport Options**:
- **Streamable HTTP**: Request/response for tools
- **SSE (Server-Sent Events)**: Real-time delivery updates

## Authentication

```bash
INFOBIP_API_KEY="App xxxxxxxxxxxxxxxx"
```

Get API key from: https://portal.infobip.com/

Format: `App {YOUR_API_KEY}`

## Channels & Tools

### SMS
- `send_sms` - Send single SMS message
- `send_bulk_sms` - Send to multiple recipients
- `get_sms_status` - Check delivery status
- `get_delivery_reports` - Bulk delivery reports
- `manage_sender_ids` - Configure sender names/numbers

**Features**:
- Unicode support (emojis, special characters)
- Long SMS (concatenated messages)
- Flash SMS
- Binary SMS

### WhatsApp Business
- `send_whatsapp_message` - Send text, media, or interactive messages
- `send_whatsapp_template` - Use pre-approved templates
- `get_whatsapp_status` - Check message status

**Message Types**:
- Text messages
- Image, video, document
- Location sharing
- Interactive buttons
- List messages
- Quick replies

### Viber Business
- `send_viber_message` - Send Viber messages
- `send_viber_image` - Send images with captions
- `send_viber_file` - Send documents/files

**Features**:
- Rich media support
- Action buttons
- Promotional/transactional messages

### RCS (Rich Communication Services)
- `send_rcs_message` - Send RCS messages
- `send_rcs_carousel` - Interactive card carousel
- `send_rcs_suggestion` - Suggested actions/replies

**Features**:
- Rich cards with images
- Carousels
- Suggested replies/actions
- Read receipts

### Two-Factor Authentication
- `send_2fa_code` - Send verification code
- `verify_2fa_code` - Validate code
- `verify_phone_number` - Verify phone ownership

**2FA Methods**:
- SMS PIN codes
- Voice call verification
- WhatsApp codes

### Contact Management
- `manage_contacts` - CRUD operations on contacts
- `create_contact_list` - Organize contacts into lists
- `update_contact` - Update contact details
- `search_contacts` - Query contact database

### Search & Analytics
- `search_messages` - Search message history
- `get_account_balance` - Check account balance
- `get_statistics` - Message statistics and analytics

## Message Formats

### SMS
```json
{
  "messages": [
    {
      "from": "InfoSMS",
      "to": "+1234567890",
      "text": "Your verification code is 123456"
    }
  ]
}
```

### WhatsApp Template
```json
{
  "from": "441234567890",
  "to": "441234567890",
  "messageId": "unique-id",
  "content": {
    "templateName": "welcome_message",
    "templateData": {
      "body": {
        "placeholders": ["John", "Order #12345"]
      }
    },
    "language": "en"
  }
}
```

### RCS Message
```json
{
  "from": "447860099299",
  "to": "441234567890",
  "content": {
    "text": "Check out our new products!",
    "suggestions": [
      {
        "text": "View Products",
        "url": "https://example.com/products"
      }
    ]
  }
}
```

## Usage (Remote Connection)

### Claude Desktop
```json
{
  "mcpServers": {
    "infobip-sms": {
      "type": "streamable-http",
      "url": "https://mcp.infobip.com/sms",
      "headers": {
        "Authorization": "App YOUR_API_KEY"
      }
    },
    "infobip-whatsapp": {
      "type": "streamable-http",
      "url": "https://mcp.infobip.com/whatsapp",
      "headers": {
        "Authorization": "App YOUR_API_KEY"
      }
    }
  }
}
```

### Environment Variable
```bash
export INFOBIP_API_KEY="App xxxxxxxxxxxxxxxx"
```

## Common Use Cases

### Customer Notifications
- Order confirmations
- Shipping updates
- Appointment reminders
- Payment receipts

### Marketing Campaigns
- Promotional SMS campaigns
- WhatsApp broadcasts
- RCS rich media campaigns
- A/B testing

### Two-Factor Authentication
- Login verification
- Transaction confirmation
- Password reset
- Account security

### Customer Support
- WhatsApp customer service
- Automated responses
- Case updates
- Survey collection

### Emergency Alerts
- Critical notifications
- Service disruptions
- Weather alerts
- Security alerts

## Delivery Reports

Real-time status updates via SSE:

```json
{
  "results": [
    {
      "messageId": "unique-id",
      "to": "+1234567890",
      "status": {
        "groupId": 3,
        "groupName": "DELIVERED",
        "id": 5,
        "name": "DELIVERED_TO_HANDSET",
        "description": "Message delivered to handset"
      },
      "sentAt": "2024-06-09T10:00:00.000Z",
      "doneAt": "2024-06-09T10:00:05.000Z"
    }
  ]
}
```

## Status Codes

| Group | Status | Description |
|-------|--------|-------------|
| 1 | PENDING | Message pending |
| 2 | UNDELIVERABLE | Cannot deliver |
| 3 | DELIVERED | Successfully delivered |
| 4 | EXPIRED | Message expired |
| 5 | REJECTED | Rejected by carrier |

## Pricing

- **Pay-as-you-go**: No subscription, pay per message
- **SMS**: $0.01-0.10 per message (varies by country)
- **WhatsApp**: $0.005-0.10 per conversation
- **RCS**: $0.01-0.05 per message
- **Free tier**: $10 credit for new accounts

## Rate Limits

- **SMS**: 200 messages/second
- **WhatsApp**: 80 messages/second (Business API limit)
- **RCS**: 100 messages/second
- **Bulk**: Up to 1M messages in single API call

## Compliance & Security

- **SOC 2 Type II** certified
- **ISO 27001** certified
- **GDPR** compliant
- **HIPAA** compliant (healthcare)
- **PCI DSS** Level 1 (payments)
- **TCPA** compliant (US regulations)
- **End-to-end encryption** for WhatsApp

## Geographic Coverage

- **SMS**: 190+ countries
- **WhatsApp**: 180+ countries
- **Viber**: 193 countries
- **RCS**: 60+ countries (expanding)
- **Voice**: 190+ countries

## Documentation

- [GitHub Repository](https://github.com/Infobip/mcp)
- [Infobip Portal](https://portal.infobip.com)
- [API Documentation](https://www.infobip.com/docs/api)
- [SMS API](https://www.infobip.com/docs/api/channels/sms)
- [WhatsApp API](https://www.infobip.com/docs/api/channels/whatsapp)
- [RCS API](https://www.infobip.com/docs/api/channels/rcs)
- [Developer Hub](https://dev.infobip.com)
