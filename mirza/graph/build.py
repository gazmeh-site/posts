"""Construction of the Mirza LangGraph application."""

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph

from .nodes import build, draft, extract_metadata, finish, images
from .state import ArticleState


def build_app():
    graph = StateGraph(ArticleState)
    graph.add_node("draft", draft)
    graph.add_node("metadata", extract_metadata)
    graph.add_node("build", build)
    graph.add_node("images", images)
    graph.add_node("finish", finish)

    graph.add_edge(START, "draft")
    graph.add_edge("draft", "metadata")
    graph.add_edge("metadata", "build")
    graph.add_edge("build", "images")
    graph.add_edge("images", "finish")
    graph.add_edge("finish", END)

    return graph.compile(
        checkpointer=MemorySaver(),
        interrupt_before=["draft", "metadata", "build", "images", "finish"],
    )
