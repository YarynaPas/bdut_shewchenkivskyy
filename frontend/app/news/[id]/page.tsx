import NewsDetails from "@/components/News/NewsDetails/NewsDetails";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function NewsPage({ params }: Props) {

    const { id } = await params;

    return <NewsDetails id={id} />;

}