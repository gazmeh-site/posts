"""Construction of the Mirza LangGraph application."""

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph

from .nodes import build, draft, enrich_apply, enrich_plan, extract_metadata, finish, images
from .state import ArticleState


def build_app():
    graph = StateGraph(ArticleState)
    graph.add_node("draft", draft)
    graph.add_node("enrich_plan", enrich_plan)
    graph.add_node("enrich_apply", enrich_apply)
    graph.add_node("metadata", extract_metadata)
    graph.add_node("build", build)
    graph.add_node("images", images)
    graph.add_node("finish", finish)

    graph.add_edge(START, "draft")
    graph.add_edge("draft", "enrich_plan")
    graph.add_edge("enrich_plan", "enrich_apply")
    graph.add_edge("enrich_apply", "metadata")
    graph.add_edge("metadata", "build")
    graph.add_edge("build", "images")
    graph.add_edge("images", "finish")
    graph.add_edge("finish", END)

    return graph.compile(
        checkpointer=MemorySaver(),
        interrupt_before=["draft", "enrich_plan", "metadata", "build", "images", "finish"],
    )
