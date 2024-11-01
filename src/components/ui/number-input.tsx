"use client";

import * as React from "react";
import { useControllableState } from "@/hooks/use-controllable-state";
import { inputVariants } from "./input";
import { cn } from "@/lib/utils";

interface UseNumberFieldProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function useNumberField({
  value: valueProp,
  onChange: onValueChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
}: UseNumberFieldProps) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const handleIncrease = (multiplier = 1) => {
    if (disabled) return;
    setValue((prevValue) =>
      Math.min((prevValue ?? 0) + step * multiplier, max)
    );
  };

  const handleDecrease = (multiplier = 1) => {
    if (disabled) return;
    setValue((prevValue) =>
      Math.max((prevValue ?? 0) - step * multiplier, min)
    );
  };

  return {
    value: value ?? 0,
    handleIncrease,
    handleDecrease,
    disabled,
  };
}

interface NumberFieldContextProps {
  value: number;
  handleIncrease: (multiplier?: number) => void;
  handleDecrease: (multiplier?: number) => void;
  disabled: boolean;
}

const NumberFieldContext = React.createContext<
  NumberFieldContextProps | undefined
>(undefined);

interface NumberFieldRootProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const NumberField: React.FC<NumberFieldRootProps> = (props) => {
  const numberField = useNumberField(props);

  return (
    <NumberFieldContext.Provider value={numberField}>
      <div
        role='group'
        className={cn(
          inputVariants({
            variant: "default",
            className: "flex focus-within:ring-ring/10 h-auto px-4 py-3",
          }),
          props.className
        )}
      >
        {props.children}
      </div>
    </NumberFieldContext.Provider>
  );
};

interface NumberFieldInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  empty?: undefined;
}

const NumberFieldInput = React.forwardRef<
  HTMLInputElement,
  NumberFieldInputProps
>((props, ref) => {
  const context = React.useContext(NumberFieldContext);
  if (!context) {
    throw new Error("NumberFieldInput must be used within a NumberFieldRoot.");
  }

  const { value, handleIncrease, handleDecrease, disabled } = context;

  const handleWheel = (event: React.WheelEvent) => {
    if (disabled) return;
    if (event.deltaY < 0) handleIncrease();
    else handleDecrease();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
        handleIncrease();
        break;
      case "ArrowDown":
      case "ArrowLeft":
        handleDecrease();
        break;
      default:
        break;
    }
  };

  return (
    <input
      type='text'
      ref={ref}
      // defaultValue={value}
      value={value}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      onChange={() => {}} // Warning: You provided a `value` prop to a form field without an `onChange` handler.
      className='focus:outline-none text-center placeholder:text-muted-foreground flex-1 min-w-0 bg-transparent font-semibold'
      {...props}
    />
  );
});

NumberFieldInput.displayName = "NumberFieldInput";

const NumberFieldIncrement = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const context = React.useContext(NumberFieldContext);
  if (!context) {
    throw new Error(
      "NumberFieldIncrement must be used within a NumberFieldRoot."
    );
  }

  const { handleIncrease, disabled } = context;

  return (
    <button
      ref={ref}
      className='focus:outline-none'
      type='button'
      onClick={(e) => {
        handleIncrease();
        if (onClick) onClick(e);
      }}
      disabled={disabled}
      {...props}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={3}
        stroke='currentColor'
        className='size-4'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M12 4.5v15m7.5-7.5h-15'
        />
      </svg>
    </button>
  );
});

NumberFieldIncrement.displayName = "NumberFieldIncrement";

const NumberFieldDecrement = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const context = React.useContext(NumberFieldContext);
  if (!context) {
    throw new Error(
      "NumberFieldDecrement must be used within a NumberFieldRoot."
    );
  }

  const { handleDecrease, disabled } = context;

  return (
    <button
      ref={ref}
      className='focus:outline-none'
      type='button'
      onClick={() => handleDecrease()}
      disabled={disabled}
      {...props}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={3}
        stroke='currentColor'
        className='size-4'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
      </svg>
    </button>
  );
});

NumberFieldDecrement.displayName = "NumberFieldDecrement";

export {
  NumberField,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
};
