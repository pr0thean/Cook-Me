import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { SelectProps } from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import { ScrollArea } from 'radix-ui'
import { Select as SelectPrimitive } from 'radix-ui'
import { Label } from 'radix-ui'
import { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useMeasureWidth } from './useMeasureWidth'

const triggerVariants = cva(
  'group w-full border rounded-sm px-3 py-2 flex items-center justify-between hover:cursor-pointer outline-none data-placeholder:text-gray',
  {
    variants: {
      variant: {
        primary:
          'text-white placeholder:text-blue-gray bg-blue-gray-dark border-blue-gray data-[state=open]:border-white focus:border-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

type SelectItemProps<T> = {
  value: T
  label: string
}

type TriggerVariantProps = VariantProps<typeof triggerVariants>

interface Props<T extends string> extends Omit<SelectProps, 'onValueChange'>, TriggerVariantProps {
  name: string
  items: SelectItemProps<T>[]
  onValueChange: (value: T) => void
  label?: string
  placeholder?: string
  value?: T
  triggerClass?: string
  contentClass?: string
}

export function Select<T extends string>({
  name,
  items,
  label,
  placeholder = 'Select...',
  value,
  variant,
  triggerClass,
  contentClass,
  onValueChange,
  ...props
}: Props<T>) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number>(0)

  useMeasureWidth({ triggerRef, setTriggerWidth, value, items })

  const triggerClassName = twMerge(triggerVariants({ variant }), triggerClass)

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <Label.Root htmlFor={name} className="cursor-pointer text-sm text-white">
          {label}
        </Label.Root>
      )}

      <SelectPrimitive.Root value={value} onValueChange={onValueChange} {...props}>
        <SelectPrimitive.Trigger
          id={name}
          name={name}
          ref={triggerRef}
          className={triggerClassName}
          aria-label={name}
        >
          <span className="truncate">
            <SelectPrimitive.Value aria-label={value || placeholder} placeholder={placeholder} />
          </span>

          <SelectPrimitive.Icon className="text-blue-gray ml-4 transition-transform duration-250 group-data-[state=open]:rotate-180">
            <ChevronDownIcon width={13} strokeWidth={4} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={8}
            side="bottom"
            className={twMerge(
              'bg-blue-gray-dark border-blue-gray z-50 rounded-sm border',
              contentClass
            )}
            style={{ minWidth: triggerWidth }}
          >
            <ScrollArea.Root className="ScrollAreaRoot" type="always">
              <SelectPrimitive.Viewport className="rounded-sm">
                <ScrollArea.Viewport className="max-h-52">
                  {items.map((item) => {
                    return (
                      <SelectPrimitive.Item
                        key={item.value}
                        value={item.value}
                        className={clsx(
                          'bg-blue-gray-dark hover:bg-gray flex items-center justify-between px-3 py-2 transition-colors outline-none hover:cursor-default',
                          {
                            'text-white': value !== item.value,
                            'text-orange font-semibold': value === item.value,
                          }
                        )}
                      >
                        <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                        <SelectPrimitive.ItemIndicator>
                          <CheckIcon width={24} className="text-orange" />
                        </SelectPrimitive.ItemIndicator>
                      </SelectPrimitive.Item>
                    )
                  })}
                </ScrollArea.Viewport>
              </SelectPrimitive.Viewport>

              <ScrollArea.Scrollbar orientation="vertical" className="mr-0.5 h-full w-2">
                <ScrollArea.Thumb className="bg-gray w-0.5 rounded-sm" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
