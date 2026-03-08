import StoreFrontend from "./StoreFrontend";

export default async function AgentStorePage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    return <StoreFrontend slug={slug} />;
}
