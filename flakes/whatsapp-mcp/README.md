# WhatsApp Business MCP Server

Manage WhatsApp Business templates and send messages via Meta Cloud API.

## Features

- **Template Management**: Create, list, and validate message templates
- **12 Template Types**: Text, image, video, document, location, authentication, carousel, coupon, catalog, MPM, limited-time offers, and flows
- **Meta Cloud API**: Direct integration with WhatsApp Business API
- **Media Support**: Send images, videos, documents, and locations
- **Message Validation**: Built-in template validation before sending

## Authentication

Requires Meta Business credentials:

1. `WHATSAPP_API_KEY`: Meta Business API key (get from Meta Business Suite)
2. `WHATSAPP_PHONE_NUMBER_ID`: WhatsApp Business phone number ID
3. `WHATSAPP_BUSINESS_ACCOUNT_ID`: Business Account ID

Get credentials from: https://developers.facebook.com/apps/

## Tools

### Template Management
- `list_templates` - List all message templates
- `get_template` - Get specific template details
- `create_template` - Create new message template
- `validate_template` - Validate template format

### Messaging
- `send_template_message` - Send pre-approved template message
- `send_text_message` - Send plain text message
- `send_image_message` - Send image with optional caption
- `send_video_message` - Send video with optional caption
- `send_document_message` - Send document/file
- `send_location_message` - Send location coordinates

## Message Formats

### Text Template
```json
{
  "type": "text",
  "components": [
    {
      "type": "BODY",
      "text": "Hello {{1}}, your order {{2}} is ready!"
    }
  ]
}
```

### Media Message
```json
{
  "type": "image",
  "url": "https://example.com/image.jpg",
  "caption": "Check out this product!"
}
```

## Usage

```bash
docker run -it \
  -e WHATSAPP_API_KEY=your_api_key \
  -e WHATSAPP_PHONE_NUMBER_ID=your_phone_id \
  -e WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id \
  mcp-flakes/whatsapp-mcp
```

## Common Use Cases

- **Customer Notifications**: Order updates, shipping alerts
- **Marketing Campaigns**: Promotional messages via templates
- **Two-Factor Auth**: Send verification codes
- **Customer Support**: Respond to inquiries
- **Appointment Reminders**: Scheduled notifications
- **E-commerce**: Product catalogs and order management

## Template Requirements

WhatsApp requires pre-approval for templates via Meta Business Suite:

1. Create template in Business Manager
2. Wait for Meta approval (24-48 hours)
3. Use approved template name in `send_template_message`

## Rate Limits

- Free tier: 1,000 conversations/month
- Template messages: Unlimited within tier
- Session messages: 24-hour window after user message

## Documentation

- [GitHub Repository](https://github.com/nakulben/whatsapp-mcp)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Meta Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Template Guidelines](https://developers.facebook.com/docs/whatsapp/message-templates)
