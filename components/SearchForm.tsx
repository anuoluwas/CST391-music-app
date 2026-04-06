// components/SearchForm.tsx
"use client";
import { useState } from "react";

interface SearchFormProps {
    onSubmit: (searchTerm: string) => void;
}

export default function SearchForm({ onSubmit }: SearchFormProps) {
    const [inputText, setInputText] = useState("");

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
        console.log(inputText);
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(inputText);
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="search-term">Search for</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter search term here"
                        onChange={handleChangeInput}
                    />
                </div>
            </form>
        </div>
    );
}