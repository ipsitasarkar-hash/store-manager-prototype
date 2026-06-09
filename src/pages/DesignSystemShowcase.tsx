/**
 * EL-Design System — Showcase Page
 * Browse every component with all variants
 */
import React, { useState } from 'react';
import {
  ConversationsIcon, DiscoverIcon, SpacesIcon, AgentsIcon, DevelopIcon,
  AddConversationIcon, PanelOpenIcon, PanelCloseIcon, AddToSpacesIcon,
  ToggleNavigationIcon, SearchIcon as ElSearchIcon, OverflowIcon, PinIcon,
} from '@/design-system/components/ElIcons';
import {
  ElButton, ElIconButton,
  ElCard, ElCardHeader, ElCardTitle, ElCardDescription, ElCardContent, ElCardFooter,
  ElInput,
  ElLabel,
  ElCheckbox,
  ElSwitch,
  ElAvatar,
  ElBadge,
  ElStatus,
  ElToken,
  ElDivider,
  ElSearchField,
  ElLink,
  ElTextArea,
  ElProgress, ElSpinner,
  ElStepIndicator,
  ElNotification,
  ElToast,
  ElTabs, ElTabsList, ElTabsTrigger, ElTabsContent,
  ElSectionHeader,
  ElJouleInput,
  ElIllustratedMessage,
  ElFileUploader,
  ElList, ElListItem,
  ElTable, ElTableHeader, ElTableBody, ElTableRow, ElTableHead, ElTableCell,
  ElSelect, ElSelectTrigger, ElSelectValue, ElSelectContent, ElSelectItem,
  ElRadioGroup, ElRadioGroupItem,
} from '@/design-system';
import { Home, Settings, Users, Mail, Star, Search, Bell, Sparkles, FileText } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-el-2xl font-bold text-el-foreground mb-4 border-b border-el-border pb-2">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <p className="text-el-xs font-semibold text-el-foreground-muted mb-2 uppercase tracking-wider">{label}</p>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

const DesignSystemShowcase = () => {
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="min-h-screen bg-el-background p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-el-md bg-el-brand flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-el-3xl font-bold text-el-foreground">EL-Design System</h1>
        </div>
        <p className="text-el-base text-el-foreground-muted">
          Component library extracted from FX UI Kit Invoicing — SAP Horizon Sapphire theme
        </p>
      </div>

      {/* Color Palette */}
      <Section title="Color Palette">
        <Row label="Blues">
          {[50,100,200,300,400,500,600,700,800,900,950].map(s => (
            <div key={s} className="text-center">
              <div className={`h-10 w-10 rounded-el-sm bg-el-blue-${s}`} style={{ backgroundColor: `hsl(var(--el-blue-${s}))` }} />
              <span className="text-[10px] text-el-foreground-muted">{s}</span>
            </div>
          ))}
        </Row>
        <Row label="Purples">
          {[50,100,200,300,400,500,600,700,800,900,950].map(s => (
            <div key={s} className="text-center">
              <div className="h-10 w-10 rounded-el-sm" style={{ backgroundColor: `hsl(var(--el-purple-${s}))` }} />
              <span className="text-[10px] text-el-foreground-muted">{s}</span>
            </div>
          ))}
        </Row>
        <Row label="Neutrals">
          {[50,100,200,300,400,500,600,700,800,900,950].map(s => (
            <div key={s} className="text-center">
              <div className="h-10 w-10 rounded-el-sm border border-el-border" style={{ backgroundColor: `hsl(var(--el-neutral-${s}))` }} />
              <span className="text-[10px] text-el-foreground-muted">{s}</span>
            </div>
          ))}
        </Row>
        <Row label="Semantic">
          {[
            { label: 'Brand', color: '--el-brand' },
            { label: 'Joule', color: '--el-joule' },
            { label: 'Success', color: '--el-success' },
            { label: 'Warning', color: '--el-warning' },
            { label: 'Error', color: '--el-error' },
            { label: 'Info', color: '--el-info' },
          ].map(c => (
            <div key={c.label} className="text-center">
              <div className="h-10 w-10 rounded-el-sm" style={{ backgroundColor: `hsl(var(${c.color}))` }} />
              <span className="text-[10px] text-el-foreground-muted">{c.label}</span>
            </div>
          ))}
        </Row>
      </Section>

      {/* Custom Icons */}
      <Section title="Custom Icons">
        <Row label="All Icons">
          {[
            { name: 'Conversations', Icon: ConversationsIcon },
            { name: 'Discover', Icon: DiscoverIcon },
            { name: 'Spaces', Icon: SpacesIcon },
            { name: 'Agents', Icon: AgentsIcon },
            { name: 'Develop', Icon: DevelopIcon },
            { name: 'AddConversation', Icon: AddConversationIcon },
            { name: 'PanelOpen', Icon: PanelOpenIcon },
            { name: 'PanelClose', Icon: PanelCloseIcon },
            { name: 'AddToSpaces', Icon: AddToSpacesIcon },
            { name: 'ToggleNav', Icon: ToggleNavigationIcon },
            { name: 'Search', Icon: ElSearchIcon },
            { name: 'Overflow', Icon: OverflowIcon },
            { name: 'Pin', Icon: PinIcon },
          ].map(({ name, Icon }) => (
            <div key={name} className="flex flex-col items-center gap-1.5 p-3 rounded-el-md hover:bg-el-surface-raised transition-colors">
              <Icon size={24} className="text-el-foreground" />
              <span className="text-[10px] text-el-foreground-muted">{name}</span>
            </div>
          ))}
        </Row>
      </Section>

      {/* Buttons */}
      <Section title="Button">
        <Row label="Brand">
          <ElButton variant="brand-primary">Primary</ElButton>
          <ElButton variant="brand-secondary">Secondary</ElButton>
          <ElButton variant="brand-tertiary">Tertiary</ElButton>
        </Row>
        <Row label="Joule">
          <ElButton variant="joule-primary"><Sparkles className="h-4 w-4" /> Primary</ElButton>
          <ElButton variant="joule-secondary">Secondary</ElButton>
          <ElButton variant="joule-tertiary">Tertiary</ElButton>
        </Row>
        <Row label="Neutral">
          <ElButton variant="neutral-primary">Primary</ElButton>
          <ElButton variant="neutral-secondary">Secondary</ElButton>
          <ElButton variant="neutral-tertiary">Tertiary</ElButton>
        </Row>
        <Row label="Other">
          <ElButton variant="destructive">Destructive</ElButton>
          <ElButton variant="ghost">Ghost</ElButton>
          <ElButton variant="link">Link</ElButton>
        </Row>
        <Row label="Sizes">
          <ElButton size="sm">Small</ElButton>
          <ElButton size="md">Medium</ElButton>
          <ElButton size="lg">Large</ElButton>
        </Row>
        <Row label="States">
          <ElButton disabled>Disabled</ElButton>
          <ElButton loading>Loading</ElButton>
        </Row>
      </Section>

      {/* Icon Buttons */}
      <Section title="Icon Button">
        <Row label="Brand">
          <ElIconButton variant="brand-primary" aria-label="Star"><Star className="h-5 w-5" /></ElIconButton>
          <ElIconButton variant="brand-secondary" aria-label="Star"><Star className="h-5 w-5" /></ElIconButton>
          <ElIconButton variant="brand-tertiary" aria-label="Star"><Star className="h-5 w-5" /></ElIconButton>
        </Row>
        <Row label="Joule">
          <ElIconButton variant="joule-primary" aria-label="Sparkles"><Sparkles className="h-5 w-5" /></ElIconButton>
          <ElIconButton variant="joule-secondary" aria-label="Sparkles"><Sparkles className="h-5 w-5" /></ElIconButton>
          <ElIconButton variant="joule-tertiary" aria-label="Sparkles"><Sparkles className="h-5 w-5" /></ElIconButton>
        </Row>
        <Row label="Neutral">
          <ElIconButton variant="neutral-primary" aria-label="Star"><Star className="h-5 w-5" /></ElIconButton>
          <ElIconButton variant="neutral-secondary" aria-label="Star"><Star className="h-5 w-5" /></ElIconButton>
          <ElIconButton variant="neutral-tertiary" aria-label="Star"><Star className="h-5 w-5" /></ElIconButton>
        </Row>
        <Row label="Sizes">
          <ElIconButton size="sm" variant="brand-primary" aria-label="Star"><Star /></ElIconButton>
          <ElIconButton size="md" variant="brand-primary" aria-label="Star"><Star /></ElIconButton>
          <ElIconButton size="lg" variant="brand-primary" aria-label="Star"><Star /></ElIconButton>
        </Row>
        <Row label="States">
          <ElIconButton variant="brand-primary" aria-label="Disabled" disabled><Star /></ElIconButton>
          <ElIconButton variant="ghost" aria-label="Ghost"><Star /></ElIconButton>
        </Row>
      </Section>

      {/* Input */}
      <Section title="Input">
        <Row label="Sizes">
          <ElInput size="sm" placeholder="Small input" />
          <ElInput size="md" placeholder="Medium input" />
          <ElInput size="lg" placeholder="Large input" />
        </Row>
        <Row label="States">
          <ElInput state="default" placeholder="Default" />
          <ElInput state="error" placeholder="Error state" />
          <ElInput state="success" placeholder="Success state" />
          <ElInput state="readonly" value="Readonly" readOnly />
        </Row>
        <Row label="With Icons">
          <ElInput leftIcon={<Search />} placeholder="Search..." />
          <ElInput rightIcon={<Mail />} placeholder="Email address" />
        </Row>
      </Section>

      {/* Text Area */}
      <Section title="Text Area">
        <div className="max-w-md space-y-3">
          <ElTextArea placeholder="Default textarea..." />
          <ElTextArea state="error" placeholder="Error textarea..." />
        </div>
      </Section>

      {/* Label */}
      <Section title="Label">
        <Row label="Tones">
          <ElLabel>Default</ElLabel>
          <ElLabel tone="muted">Muted</ElLabel>
          <ElLabel tone="brand">Brand</ElLabel>
          <ElLabel tone="error">Error</ElLabel>
          <ElLabel tone="success">Success</ElLabel>
        </Row>
        <Row label="Required">
          <ElLabel required>Required Field</ElLabel>
        </Row>
      </Section>

      {/* Search Field */}
      <Section title="Search Field">
        <div className="max-w-sm">
          <ElSearchField value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onClear={() => setSearchVal('')} placeholder="Search items..." />
        </div>
      </Section>

      {/* Select / Combobox */}
      <Section title="Select / Combobox">
        <div className="max-w-xs">
          <ElSelect>
            <ElSelectTrigger>
              <ElSelectValue placeholder="Choose an option..." />
            </ElSelectTrigger>
            <ElSelectContent>
              <ElSelectItem value="opt1">Option 1</ElSelectItem>
              <ElSelectItem value="opt2">Option 2</ElSelectItem>
              <ElSelectItem value="opt3">Option 3</ElSelectItem>
            </ElSelectContent>
          </ElSelect>
        </div>
      </Section>

      {/* Checkbox, Radio, Switch */}
      <Section title="Checkbox, Radio & Switch">
        <Row label="Checkbox">
          <div className="flex items-center gap-2"><ElCheckbox id="c1" /><ElLabel htmlFor="c1">Unchecked</ElLabel></div>
          <div className="flex items-center gap-2"><ElCheckbox id="c2" defaultChecked /><ElLabel htmlFor="c2">Checked</ElLabel></div>
          <div className="flex items-center gap-2"><ElCheckbox id="c3" disabled /><ElLabel htmlFor="c3">Disabled</ElLabel></div>
        </Row>
        <Row label="Radio">
          <ElRadioGroup defaultValue="r1">
            <div className="flex items-center gap-2"><ElRadioGroupItem value="r1" id="r1" /><ElLabel htmlFor="r1">Option A</ElLabel></div>
            <div className="flex items-center gap-2"><ElRadioGroupItem value="r2" id="r2" /><ElLabel htmlFor="r2">Option B</ElLabel></div>
          </ElRadioGroup>
        </Row>
        <Row label="Switch">
          <ElSwitch />
          <ElSwitch defaultChecked />
          <ElSwitch disabled />
        </Row>
      </Section>

      {/* Avatar */}
      <Section title="Avatar">
        <Row label="Sizes">
          <ElAvatar size="xs" fallback="XS" />
          <ElAvatar size="sm" fallback="SM" />
          <ElAvatar size="md" fallback="MD" />
          <ElAvatar size="lg" fallback="LG" />
          <ElAvatar size="xl" fallback="XL" />
        </Row>
        <Row label="Shape">
          <ElAvatar shape="circle" fallback="C" />
          <ElAvatar shape="square" fallback="S" />
        </Row>
      </Section>

      {/* Badge & Status */}
      <Section title="Badge & Status">
        <Row label="Badges">
          <ElBadge variant="brand">Brand</ElBadge>
          <ElBadge variant="joule">Joule</ElBadge>
          <ElBadge variant="success">Success</ElBadge>
          <ElBadge variant="warning">Warning</ElBadge>
          <ElBadge variant="error">Error</ElBadge>
          <ElBadge variant="neutral">Neutral</ElBadge>
        </Row>
        <Row label="Status">
          <ElStatus variant="success">Active</ElStatus>
          <ElStatus variant="warning">Pending</ElStatus>
          <ElStatus variant="error">Failed</ElStatus>
          <ElStatus variant="info">Processing</ElStatus>
          <ElStatus variant="neutral">Inactive</ElStatus>
        </Row>
      </Section>

      {/* Token / Tag */}
      <Section title="Token / Tag">
        <Row label="Variants">
          <ElToken variant="neutral">Neutral</ElToken>
          <ElToken variant="brand">Brand</ElToken>
          <ElToken variant="joule">Joule</ElToken>
          <ElToken variant="success">Success</ElToken>
          <ElToken variant="warning" onRemove={() => {}}>Removable</ElToken>
          <ElToken variant="error" onRemove={() => {}}>Error</ElToken>
        </Row>
      </Section>

      {/* Link */}
      <Section title="Link">
        <Row label="Variants">
          <ElLink variant="brand" href="#">Brand Link</ElLink>
          <ElLink variant="joule" href="#">Joule Link</ElLink>
          <ElLink variant="subtle" href="#">Subtle Link</ElLink>
          <ElLink variant="default" href="#">Default Link</ElLink>
        </Row>
      </Section>

      {/* Divider */}
      <Section title="Divider">
        <ElDivider />
        <div className="flex items-center h-8 gap-4">
          <span className="text-el-sm">Left</span>
          <ElDivider orientation="vertical" />
          <span className="text-el-sm">Right</span>
        </div>
      </Section>

      {/* Card */}
      <Section title="Card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ElCard elevation="flat">
            <ElCardHeader><ElCardTitle>Flat Card</ElCardTitle><ElCardDescription>Border only</ElCardDescription></ElCardHeader>
            <ElCardContent><p className="text-el-sm">Card content goes here.</p></ElCardContent>
            <ElCardFooter><ElButton size="sm" variant="brand-secondary">Action</ElButton></ElCardFooter>
          </ElCard>
          <ElCard elevation="raised">
            <ElCardHeader><ElCardTitle>Raised Card</ElCardTitle><ElCardDescription>Subtle shadow</ElCardDescription></ElCardHeader>
            <ElCardContent><p className="text-el-sm">Card content goes here.</p></ElCardContent>
          </ElCard>
          <ElCard elevation="elevated">
            <ElCardHeader><ElCardTitle>Elevated Card</ElCardTitle><ElCardDescription>Strong shadow</ElCardDescription></ElCardHeader>
            <ElCardContent><p className="text-el-sm">Card content goes here.</p></ElCardContent>
          </ElCard>
        </div>
      </Section>

      {/* Tabs */}
      <Section title="Tabs / Tabbar">
        <ElTabs defaultValue="tab1">
          <ElTabsList>
            <ElTabsTrigger value="tab1"><Home className="h-4 w-4" /> Overview</ElTabsTrigger>
            <ElTabsTrigger value="tab2"><Settings className="h-4 w-4" /> Settings</ElTabsTrigger>
            <ElTabsTrigger value="tab3"><Users className="h-4 w-4" /> Members</ElTabsTrigger>
          </ElTabsList>
          <ElTabsContent value="tab1"><p className="text-el-sm text-el-foreground-muted">Overview tab content</p></ElTabsContent>
          <ElTabsContent value="tab2"><p className="text-el-sm text-el-foreground-muted">Settings tab content</p></ElTabsContent>
          <ElTabsContent value="tab3"><p className="text-el-sm text-el-foreground-muted">Members tab content</p></ElTabsContent>
        </ElTabs>
      </Section>

      {/* Table */}
      <Section title="Table">
        <ElCard elevation="flat" padding="none">
          <ElTable>
            <ElTableHeader>
              <ElTableRow>
                <ElTableHead>Invoice</ElTableHead>
                <ElTableHead>Status</ElTableHead>
                <ElTableHead>Amount</ElTableHead>
              </ElTableRow>
            </ElTableHeader>
            <ElTableBody>
              <ElTableRow>
                <ElTableCell className="font-medium">INV-001</ElTableCell>
                <ElTableCell><ElStatus variant="success">Paid</ElStatus></ElTableCell>
                <ElTableCell>$2,500.00</ElTableCell>
              </ElTableRow>
              <ElTableRow>
                <ElTableCell className="font-medium">INV-002</ElTableCell>
                <ElTableCell><ElStatus variant="warning">Pending</ElStatus></ElTableCell>
                <ElTableCell>$1,200.00</ElTableCell>
              </ElTableRow>
              <ElTableRow>
                <ElTableCell className="font-medium">INV-003</ElTableCell>
                <ElTableCell><ElStatus variant="error">Overdue</ElStatus></ElTableCell>
                <ElTableCell>$3,800.00</ElTableCell>
              </ElTableRow>
            </ElTableBody>
          </ElTable>
        </ElCard>
      </Section>

      {/* List */}
      <Section title="List">
        <ElCard elevation="flat" padding="none" className="max-w-md">
          <ElList>
            <ElListItem><Mail className="h-4 w-4 text-el-icon-muted" /> Inbox Messages</ElListItem>
            <ElListItem selected><Star className="h-4 w-4 text-el-brand" /> Starred Items</ElListItem>
            <ElListItem><Bell className="h-4 w-4 text-el-icon-muted" /> Notifications</ElListItem>
            <ElListItem disabled><Settings className="h-4 w-4 text-el-icon-muted" /> Disabled Item</ElListItem>
          </ElList>
        </ElCard>
      </Section>

      {/* Progress & Spinner */}
      <Section title="Progress & Busy Indicator">
        <Row label="Progress Bars">
          <div className="w-full max-w-md space-y-3">
            <ElProgress value={25} variant="brand" />
            <ElProgress value={60} variant="joule" />
            <ElProgress value={100} variant="success" />
            <ElProgress value={40} variant="warning" size="lg" />
          </div>
        </Row>
        <Row label="Spinners">
          <ElSpinner size="sm" />
          <ElSpinner size="md" />
          <ElSpinner size="lg" variant="joule" />
        </Row>
      </Section>

      {/* Step Indicator */}
      <Section title="Step Indicator">
        <ElStepIndicator
          currentStep={1}
          steps={[
            { label: 'Upload', description: 'Select files' },
            { label: 'Review', description: 'Check data' },
            { label: 'Submit', description: 'Confirm' },
          ]}
        />
      </Section>

      {/* Section Header */}
      <Section title="Section Header">
        <ElSectionHeader title="Recent Invoices" subtitle="Last 30 days" actions={<ElButton size="sm" variant="brand-secondary">View All</ElButton>} />
      </Section>

      {/* Notification */}
      <Section title="Notification / Alert">
        <div className="space-y-3 max-w-lg">
          <ElNotification variant="info" title="Information" description="This is an informational notification." />
          <ElNotification variant="success" title="Success" description="Operation completed successfully." />
          <ElNotification variant="warning" title="Warning" description="Proceed with caution." />
          <ElNotification variant="error" title="Error" description="Something went wrong." onClose={() => {}} />
        </div>
      </Section>

      {/* Toast */}
      <Section title="Toast">
        <div className="space-y-3 max-w-sm">
          <ElToast variant="default" title="Default Toast" description="This is a toast notification." />
          <ElToast variant="success" title="Saved" description="Changes saved successfully." onClose={() => {}} />
        </div>
      </Section>

      {/* Joule Input */}
      <Section title="Joule Input">
        <div className="max-w-lg">
          <ElJouleInput placeholder="Ask Joule anything..." />
        </div>
      </Section>

      {/* File Uploader */}
      <Section title="File Uploader">
        <div className="max-w-md">
          <ElFileUploader accept=".pdf,.csv,.xlsx" />
        </div>
      </Section>

      {/* Illustrated Message */}
      <Section title="Illustrated Message">
        <ElCard elevation="flat">
          <ElIllustratedMessage
            illustration={<FileText className="h-16 w-16" />}
            title="No invoices found"
            description="Create your first invoice to get started."
            actions={<ElButton variant="brand-primary">Create Invoice</ElButton>}
          />
        </ElCard>
      </Section>

      {/* Footer */}
      <div className="mt-16 pt-6 border-t border-el-border text-center">
        <p className="text-el-sm text-el-foreground-muted">
          EL-Design System • Extracted from FX UI Kit Invoicing • SAP Horizon Sapphire Theme
        </p>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
