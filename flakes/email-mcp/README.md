# Email MCP Server

Full-featured IMAP/SMTP email server with multi-account support and AI triage.

## Features

- **42 Email Tools**: Complete email management suite
- **IMAP + SMTP**: Read via IMAP, send via SMTP
- **Multi-Account Support**: Manage multiple email accounts
- **Auto-Provider Detection**: Gmail, Outlook, Yahoo, iCloud
- **IMAP IDLE Push**: Real-time notifications for new emails
- **AI Triage**: Smart email categorization and prioritization
- **Desktop Notifications**: System notifications for new mail
- **Attachment Management**: Download and manage attachments
- **Email Scheduling**: Schedule emails for later delivery

## Authentication

Configure accounts via `EMAIL_ACCOUNTS` environment variable (JSON array):

```json
[
  {
    "name": "work",
    "email": "user@company.com",
    "imap": {
      "host": "imap.gmail.com",
      "port": 993,
      "secure": true,
      "auth": {
        "user": "user@company.com",
        "pass": "app_password"
      }
    },
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "user@company.com",
        "pass": "app_password"
      }
    }
  }
]
```

### Provider-Specific Setup

#### Gmail
1. Enable 2FA
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password instead of regular password

#### Outlook/Office365
- IMAP: `outlook.office365.com:993`
- SMTP: `smtp.office365.com:587`
- Use account password or App Password

#### iCloud
1. Enable 2FA
2. Generate App-Specific Password: https://appleid.apple.com
3. IMAP: `imap.mail.me.com:993`
4. SMTP: `smtp.mail.me.com:587`

#### Yahoo
1. Enable 2FA
2. Generate App Password
3. IMAP: `imap.mail.yahoo.com:993`
4. SMTP: `smtp.mail.yahoo.com:587`

## Tools

### Account Management
- `list_accounts` - List configured email accounts
- `list_mailboxes` - List folders/mailboxes in account

### Reading & Search
- `search_emails` - Search emails with filters (from, subject, date, etc.)
- `read_email` - Read full email content with attachments
- `list_attachments` - List all attachments in an email
- `download_attachment` - Download specific attachment

### Sending & Replies
- `send_email` - Send new email with attachments
- `reply_email` - Reply to existing email
- `forward_email` - Forward email to others
- `schedule_send` - Schedule email for future delivery

### Organization
- `move_email` - Move email to different folder
- `delete_email` - Delete email (move to trash)
- `mark_read` - Mark email as read
- `mark_unread` - Mark email as unread
- `create_mailbox` - Create new folder
- `delete_mailbox` - Delete folder

### AI Features
- `triage_emails` - AI-powered email categorization
- `get_notifications` - Get desktop notifications for new mail

## Search Filters

```typescript
{
  "from": "sender@example.com",
  "to": "recipient@example.com",
  "subject": "invoice",
  "since": "2024-01-01",
  "before": "2024-12-31",
  "unseen": true,
  "flagged": true,
  "body": "search term"
}
```

## Message Format

```json
{
  "from": "sender@example.com",
  "to": ["recipient@example.com"],
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "subject": "Email Subject",
  "text": "Plain text body",
  "html": "<p>HTML body</p>",
  "attachments": [
    {
      "filename": "document.pdf",
      "path": "/path/to/file.pdf"
    }
  ]
}
```

## Usage

```bash
docker run -it \
  -e EMAIL_ACCOUNTS='[{"name":"work","email":"user@gmail.com",...}]' \
  mcp-flakes/email-mcp
```

## Common Use Cases

- **Email Automation**: Auto-reply, forwarding rules
- **Inbox Management**: Organize and clean up emails
- **Customer Support**: Respond to support emails
- **Newsletter Management**: Search and organize newsletters
- **Attachment Processing**: Extract and process attachments
- **Email Analytics**: Analyze email patterns and trends
- **Multi-Account Sync**: Manage multiple accounts from one interface

## IMAP IDLE Push Notifications

Real-time notifications when new emails arrive (no polling):

```json
{
  "account": "work",
  "mailbox": "INBOX",
  "idle": true
}
```

## Rate Limits & Best Practices

- **Gmail**: 500 emails/day (free), 2,000/day (workspace)
- **Outlook**: 300 emails/day (free), 10,000/day (365)
- **IMAP connections**: Limit concurrent connections
- **Attachment size**: Check provider limits (typically 25MB)

## Troubleshooting

### "Invalid credentials"
- Use App Password, not account password
- Enable 2FA first
- Check IMAP/SMTP settings

### "Too many connections"
- Close idle connections
- Reduce concurrent operations
- Check provider limits

### "IMAP not enabled"
- Gmail: Settings → Forwarding and POP/IMAP → Enable IMAP
- Outlook: Should be enabled by default
- iCloud: Settings → iCloud → Mail

## Documentation

- [GitHub Repository](https://github.com/codefuturist/email-mcp)
- [IMAP Protocol](https://tools.ietf.org/html/rfc3501)
- [SMTP Protocol](https://tools.ietf.org/html/rfc5321)
- [Gmail API](https://developers.google.com/gmail/api)
