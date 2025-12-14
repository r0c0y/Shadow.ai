# Agent Zero Chrome Extension

> 🤖 Autonomous AI development assistant that brings code analysis, security scanning, and automated fixes directly to your GitHub/GitLab workflow.

## ✨ Features

### 🎯 Core Capabilities
- **Real-time MCS Display**: Shows Merge Confidence Score directly in PR interface
- **One-Click Actions**: Trigger analysis, security scans, and auto-fixes without leaving the page
- **Inline Code Explanations**: Hover over code lines for AI-powered explanations
- **Multi-Model Selection**: Choose the best AI model for each task type
- **Live Notifications**: Get instant feedback on analysis completion and issues found

### 🔧 GitHub/GitLab Integration
- **Status Checks**: MCS badge with detailed breakdown in PR headers
- **PR Comments**: Structured AI analysis with actionable steps
- **File Annotations**: Inline suggestions and explanations in code view
- **Context Menu**: Right-click any code selection for instant analysis
- **Floating Sidebar**: Detailed analysis results and recommendations

### 🎨 User Experience
- **Popup Interface**: Quick access to settings and actions from toolbar
- **Options Page**: Advanced configuration and team management
- **Dark Mode Support**: Automatic theme detection and adaptation
- **Accessibility**: Full WCAG 2.1 compliance with screen reader support
- **Performance**: Optimized for minimal impact on page load times

## 🚀 Quick Start

### Prerequisites
- Chrome 88+ (Manifest V3 support)
- Agent Zero backend running (Kestra + Dashboard)
- GitHub or GitLab account

### Installation (Development)

1. **Clone and setup**:
   ```bash
   git clone https://github.com/your-username/agent-zero
   cd agent-zero/chrome-extension
   npm install
   ```

2. **Build the extension**:
   ```bash
   npm run build
   # or for development with hot reload
   npm run dev
   ```

3. **Load in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder

4. **Configure backend**:
   - Click the Agent Zero icon in toolbar
   - Set Kestra URL: `http://localhost:8080`
   - Set Dashboard URL: `http://localhost:3000`
   - Test connections and save

### First Use

1. **Navigate to a GitHub PR** (e.g., https://github.com/owner/repo/pull/123)
2. **Look for the MCS badge** in the PR header showing confidence score
3. **Try the action buttons** below the PR description:
   - 🔍 **Analyze**: Run comprehensive code analysis
   - 🔒 **Security Scan**: Check for vulnerabilities
   - 🛠️ **Auto-Fix**: Apply automated fixes
   - 📝 **Generate Tests**: Create unit tests
4. **Click the MCS badge** for detailed breakdown and recommendations

## 🔧 Configuration

### Basic Settings (Popup)
- **Backend URLs**: Configure Kestra and Dashboard endpoints
- **Notifications**: Enable/disable browser notifications
- **AI Models**: Select preferred models for different tasks

### Advanced Settings (Options Page)
- **Performance Tuning**: Concurrent analyses, timeouts, retry attempts
- **Team Settings**: Team collaboration features (coming soon)
- **Debug Mode**: Detailed logging for troubleshooting

### AI Model Selection

| Task Type | Recommended | Alternative | Use Case |
|-----------|-------------|-------------|----------|
| **Code Analysis** | Gemini Pro | GPT-4, Claude 3.5 | Understanding structure and complexity |
| **Security Scan** | Gemini Pro | GPT-4 | Finding vulnerabilities and security issues |
| **Auto-Fix** | Cline CLI | GPT-4 | Making autonomous code changes |
| **Documentation** | Claude 3.5 | GPT-4, Gemini | Writing clear explanations and docs |

## 🛠️ Development

### Project Structure
```
chrome-extension/
├── src/
│   ├── background.ts      # Service worker for API communication
│   ├── content.ts         # GitHub/GitLab page injection
│   ├── popup.tsx          # Popup interface (React)
│   └── options.tsx        # Options page (React)
├── styles/
│   └── content.css        # Injected styles for GitHub/GitLab
├── assets/                # Icons and images
├── scripts/
│   └── build.js           # Custom build script
├── manifest.json          # Extension manifest
└── package.json           # Dependencies and scripts
```

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Package for Chrome Web Store
npm run package

# Run tests
npm test

# Lint and format code
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

### Key Technologies
- **Framework**: Plasmo (Chrome extension framework)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Chrome Storage API + React hooks
- **Communication**: Chrome Messaging API + Fetch API
- **Build**: Plasmo + custom build scripts

### Adding New Features

1. **Content Script Features** (GitHub/GitLab integration):
   ```typescript
   // src/content.ts
   function injectNewFeature() {
     const targetElement = document.querySelector('.target-selector');
     if (targetElement) {
       const newElement = createFeatureElement();
       targetElement.appendChild(newElement);
     }
   }
   ```

2. **Popup Features** (toolbar interface):
   ```tsx
   // src/popup.tsx
   const NewFeatureComponent: React.FC = () => {
     return (
       <div className="p-4">
         <h3>New Feature</h3>
         {/* Feature implementation */}
       </div>
     );
   };
   ```

3. **Background Features** (API communication):
   ```typescript
   // src/background.ts
   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
     if (message.type === 'NEW_FEATURE_ACTION') {
       handleNewFeatureAction(message.data, sendResponse);
     }
   });
   ```

## 🔍 API Integration

### Kestra Workflow Triggers
```typescript
// Trigger analysis workflow
const response = await fetch(`${kestraUrl}/api/v1/executions/webhook/com.agentzero/github-events/github-trigger`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repository: { full_name: 'owner/repo' },
    pull_request: { number: 123 },
    trigger_source: 'chrome_extension'
  })
});
```

### Dashboard API Calls
```typescript
// Get MCS score
const mcsResponse = await fetch(`${dashboardUrl}/api/mcs-score?pr=${encodeURIComponent(prUrl)}`);
const mcsData = await mcsResponse.json();
```

### Real-time Updates
```typescript
// WebSocket connection for live updates
const ws = new WebSocket(`${dashboardUrl.replace('http', 'ws')}/ws`);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'mcs_update') {
    updateMCSDisplay(data.score, data.status);
  }
};
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Extension loads without errors
- [ ] MCS badge appears on GitHub PRs
- [ ] Action buttons trigger workflows
- [ ] Popup interface works correctly
- [ ] Options page saves settings
- [ ] Context menu items function
- [ ] Notifications display properly
- [ ] Dark mode switches correctly

### Automated Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests (requires Chrome)
npm run test:e2e
```

### Test with Real GitHub PRs
1. Create a test repository
2. Open a pull request
3. Load the extension
4. Test all features end-to-end
5. Verify backend integration

## 🚨 Troubleshooting

### Common Issues

#### Extension Not Loading
- **Check Chrome version**: Requires Chrome 88+ for Manifest V3
- **Check console errors**: Open `chrome://extensions/` and check for errors
- **Verify build**: Ensure `manifest.json` exists in build directory

#### Backend Connection Failed
- **Verify URLs**: Check Kestra (8080) and Dashboard (3000) are running
- **Test endpoints**: Use browser to visit health check endpoints
- **Check CORS**: Ensure backend allows extension origin

#### MCS Score Not Updating
- **Check PR format**: Verify URL matches expected GitHub/GitLab pattern
- **Inspect network**: Check browser DevTools for failed API calls
- **Verify webhooks**: Ensure Kestra workflows are properly configured

#### Permissions Issues
- **Host permissions**: Verify extension has access to GitHub/GitLab
- **Storage permissions**: Check Chrome storage quota and permissions
- **Notification permissions**: Ensure browser notifications are enabled

### Debug Mode
Enable debug mode in extension options to:
- See detailed console logs
- View API request/response data
- Monitor extension state changes
- Track performance metrics

### Getting Help
1. **Check logs**: Browser console (F12) for error messages
2. **Test backend**: Use "Test" buttons in extension settings
3. **Report issues**: GitHub issues with reproduction steps
4. **Community**: Join Discord for real-time support

## 📦 Distribution

### Chrome Web Store (Coming Soon)
- Automated review process
- Automatic updates for users
- Analytics and user feedback
- Monetization options

### Manual Distribution
1. **Build for production**:
   ```bash
   npm run build
   npm run package
   ```

2. **Share the ZIP file** with team members
3. **Load unpacked** in Chrome developer mode

### Enterprise Distribution
- **Chrome Enterprise Policy**: Deploy via organization policies
- **Custom Chrome Store**: Private enterprise app store
- **Manual Installation**: IT-managed deployment

## 🔒 Security & Privacy

### Data Handling
- **No code storage**: Code analyzed in real-time, never stored
- **Local settings**: All configuration stored in Chrome local storage
- **Secure communication**: HTTPS for all production API calls
- **No tracking**: Extension doesn't collect usage analytics

### Permissions Explained
- **activeTab**: Access current tab for GitHub/GitLab integration
- **storage**: Store user preferences and configuration locally
- **notifications**: Show analysis results and error notifications
- **host_permissions**: Access GitHub and GitLab domains only

### Security Best Practices
- Regular security audits
- Dependency vulnerability scanning
- Content Security Policy enforcement
- Input sanitization and validation

## 📈 Performance

### Optimization Strategies
- **Lazy loading**: Components loaded on demand
- **Efficient DOM queries**: Cached selectors and minimal DOM manipulation
- **Debounced API calls**: Prevent excessive backend requests
- **Memory management**: Proper cleanup of event listeners and timers

### Performance Metrics
- **Load time**: < 100ms extension initialization
- **Memory usage**: < 10MB typical memory footprint
- **Network requests**: Batched and optimized API calls
- **CPU usage**: Minimal impact on browser performance

## 🗺️ Roadmap

### v1.1.0 (Next Release)
- [ ] GitLab support improvements
- [ ] Offline mode capabilities
- [ ] Enhanced keyboard shortcuts
- [ ] Custom AI model integration

### v1.2.0 (Future)
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Custom workflow builder
- [ ] Enterprise SSO integration

### v2.0.0 (Long-term)
- [ ] Multi-repository analysis
- [ ] AI model fine-tuning
- [ ] Advanced security scanning
- [ ] Integration marketplace

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Testing requirements
- Pull request process

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Extension Version**: 1.0.0-alpha  
**Last Updated**: December 2024  
**Minimum Chrome Version**: 88  
**Supported Platforms**: GitHub, GitLab