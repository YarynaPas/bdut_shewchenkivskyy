import GurtkyDetails from "@/components/GurtkyDetails/GurtkyDetails";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function GurtkyDetailsPage({
                                                    params,
                                                }: Props) {

    const { id } = await params;

    return (
        <GurtkyDetails id={id} />
    );
}