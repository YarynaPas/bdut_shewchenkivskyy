import PsychologyDetails from "@/components/Psychology/PsychologyDetails/PsychologyDetails";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PsychologyPage({ params }: Props) {

    const { id } = await params;

    return (
        <PsychologyDetails id={id} />
    );
}