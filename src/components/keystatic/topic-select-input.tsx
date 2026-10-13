"use client";

import { useEffect, useState } from "react";
import { Combobox, Item } from "@keystar/ui/combobox";

type Option = { label: string; value: string };

const INITIAL_FALLBACK_OPTIONS: Option[] = [
  { label: "Namaste AI", value: "namaste-ai" },
  { label: "Next.js", value: "nextjs" },
  { label: "Node.js", value: "node" },
  { label: "React", value: "react" },
];

export function TopicSelectInput(props: {
  value: string | null;
  onChange: (value: string | null) => void;
  autoFocus?: boolean;
  forceValidation?: boolean;
  label?: string;
  description?: string;
  validation?: { isRequired?: boolean };
  onBlur?: () => void;
}) {

  const [options, setOptions] = useState<Option[]>(INITIAL_FALLBACK_OPTIONS);

  useEffect(() => {
    fetch("/api/topics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load topics");
        return res.json();
      })
      .then((data: Option[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setOptions(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching topics for Keystatic dropdown:", err);
      });
  }, []);

  return (
    <Combobox
      label={props.label || "Topic"}
      description={props.description}

      selectedKey={props.value || undefined}
      onSelectionChange={(key) => {
        props.onChange(key ? String(key) : null);
      }}
      onBlur={props.onBlur}
      autoFocus={props.autoFocus}
      defaultItems={options}
      items={options}
      isRequired={props.validation?.isRequired}
      width="auto"
    >
      {(item: Option) => <Item key={item.value}>{item.label}</Item>}
    </Combobox>
  );
}
