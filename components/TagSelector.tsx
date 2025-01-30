"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const defaultTags = [
    "AI",
    "Hollywood",
    "Health",
    "Science",
]

export default function TagSelector() {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<string[]>([])
    const [inputValue, setInputValue] = React.useState("")

    const [availableTags, setAvailableTags] = React.useState<string[]>(defaultTags)

    const handleSelect = React.useCallback((value: string) => {
        setSelected((prev) => {
            if (prev.includes(value)) {
                return prev
            }
            return [...prev, value]
        })

        setInputValue("")
    }, [])

    const handleRemove = React.useCallback((tag: string) => {
        setSelected((prev) => prev.filter((s) => s !== tag))
    }, [])

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (!input) return

            // Add custom tag when pressing enter
            if (e.key === "Enter" && inputValue && !availableTags.includes(inputValue)) {
                setAvailableTags((prev) => [...prev, inputValue])
                handleSelect(inputValue)
                setOpen(false)
            }
        },
        [inputValue, availableTags, handleSelect],
    )

    return (
        <div className="flex flex-col gap-4 w-full max-w-[600px]">
            <label className="text-sm font-medium">
                Sub Tags(optional)
            </label>

            <div className="relative">
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg mb-2">
                    {selected.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-200"
                        >
                            {tag}
                            <button
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRemove(tag)
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onClick={() => handleRemove(tag)}
                            >
                                <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                                <span className="sr-only">Remove {tag}</span>
                            </button>
                        </Badge>
                    ))}
                </div>

                <Command className="border rounded-lg" onKeyDown={handleKeyDown}>
                    <CommandInput
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        placeholder="Search or add custom tags..."
                        className="border-0"
                    />

                    <CommandList>
                        <CommandEmpty>{inputValue ? "Press enter to add custom tag" : "No tags found."}</CommandEmpty>
                        <CommandGroup>
                            {availableTags
                                .filter((tag) => !selected.includes(tag))
                                .map((tag) => (
                                    <CommandItem key={tag} value={tag} onSelect={handleSelect}>
                                        {tag}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
        </div>
    )
}

