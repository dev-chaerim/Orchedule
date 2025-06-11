"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface FilterDropdownProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  buttonClassName?: string;
  optionClassName?: string;
}

export default function FilterDropdown({
  options,
  selected,
  onChange,
  buttonClassName = "bg-[#f8f6f2] text-[#3e3232d4]",
  optionClassName = "text-[#3e3232]",
}: FilterDropdownProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative w-full">
        <Listbox.Button
          className={`relative w-full cursor-pointer rounded-xl py-2 pl-4 pr-8 text-sm text-center shadow font-semibold ${buttonClassName}`}
        >
          {selected || "전체"}
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <ChevronDownIcon
              className="h-4 w-4 text-[#7e6a5c]"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 w-full rounded-xl bg-white shadow-lg z-10 text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 text-center ${optionClassName} ${
                    active ? "bg-[#f0eae1]" : ""
                  }`
                }
                value={option}
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
