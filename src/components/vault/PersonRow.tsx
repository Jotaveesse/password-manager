import { useState } from "react";
import IconButton from "../ui/IconButton.tsx";
import EditableLabel from "../ui/EditableLabel.tsx";
import AccountRow from "./AccountRow.tsx";
import ImagePlus from "../../assets/plus.svg";
import ImageMinus from "../../assets/minus.svg";
import DownArrow from "../../assets/down-arrow.svg";
import UpArrow from "../../assets/up-arrow.svg";
import {
    useData,
    type Person,
    type Credential,
} from "../../context/DataContext.tsx";

interface PersonRowProps extends React.HTMLAttributes<HTMLDivElement> {
    person: Person;
    defaultExpanded?: boolean;
    onSeeCodes?: (credential: Credential, target: HTMLElement) => void;
}

const PersonRow = ({
    person,
    onSeeCodes,
    className,
    defaultExpanded,
    ...rest
}: PersonRowProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const { updatePersonName, removePerson, createAccount } = useData();

    const handleRemove = () => {
        const name = person.name || "this person";
        if (
            window.confirm(
                `Remove ${name} and all of their accounts and credentials?`,
            )
        ) {
            removePerson(person);
        }
    };

    return (
        <div
            className={`w-100 d-flex flex-column row-gap-1 bg-secondary p-2 rounded-3 ${className ?? ""}`}
            {...rest}
        >
            <div className="d-flex">
                <EditableLabel
                    value={person.name}
                    onChange={(name) => updatePersonName(person, name)}
                    label="Person name"
                    fallback="Unnamed person"
                    inputClassName="bg-primary fs-5 p-1 border-0 rounded-3 h-75 m-auto text-white fw-bold"
                    textClassName="flex-grow-1 fs-5 mt-auto mb-auto ms-1"
                />

                <div className="d-flex">
                    <IconButton
                        icon={ImageMinus}
                        title="Remove Person"
                        variant="secondary"
                        onClick={handleRemove}
                    />

                    <IconButton
                        icon={expanded ? UpArrow : DownArrow}
                        title={expanded ? "Collapse" : "Expand"}
                        aria-expanded={expanded}
                        variant="secondary"
                        onClick={() => setExpanded((open) => !open)}
                    />
                </div>
            </div>

            {expanded && (
                <>
                    <div className="person-accounts">
                        {person.accounts.map((account) => (
                            <AccountRow
                                key={account.id}
                                account={account}
                                onSeeCodes={onSeeCodes}
                            />
                        ))}
                    </div>

                    <IconButton
                        icon={ImagePlus}
                        title="Add New Account"
                        variant="secondary"
                        outerPadding={false}
                        onClick={() => createAccount(person)}
                    />
                </>
            )}
        </div>
    );
};

export default PersonRow;
