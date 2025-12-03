import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import React from 'react';

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  children: React.ReactNode;
}

export function Select({ label, value, onChange, children }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs sm:text-sm text-muted-foreground">{label}</label>}
      <RadixSelect.Root value={value} onValueChange={(v) => onChange({ target: { value: v } })}>
        <RadixSelect.Trigger className="inline-flex items-center justify-between w-full rounded-full border border-input bg-white px-4 py-2 sm:py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary/60">
          <RadixSelect.Value />
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="z-50 overflow-hidden rounded-xl border bg-white shadow-soft">
            <RadixSelect.Viewport className="p-1">
              {React.Children.map(children as React.ReactElement[], (child) => {
                if (!React.isValidElement(child)) return child;
                const childProps = child.props as { value?: string; children: React.ReactNode };
                return (
                  <RadixSelect.Item
                    key={childProps.value || ''}
                    value={childProps.value || ''}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-muted focus:bg-muted outline-none"
                  >
                    <RadixSelect.ItemText>{childProps.children}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator>
                      <Check className="h-4 w-4 text-primary" />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                );
              })}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}

export default Select;
